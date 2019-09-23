import json
import logging

import boto3
import db
import pandas as pd
import settings

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')


def main(event, context):
    """Invoke with
    python mocks.py <JobID> | sls invoke local --function main --docker --docker-arg="--network host"
    """
    logger.info(f'Incoming event: {event}')

    for record in event['Records']:
        body = json.loads(record['body'])
        job_pk = body['job_pk']
        job = db.Job.select().join(db.JobStep).switch(db.Job).join(db.DataSource).where(
            (db.Job.id == job_pk) & (db.Job.job_state == 'pending')
        ).get()

        job.job_state = db.JobState.IN_PROGRESS
        job.save()

        body = s3.get_object(Bucket=settings.DATASOURCE_S3_BUCKET, Key=job.datasource.file)['Body'].read()
        lines = pd.read_csv(body)

        for step in job.steps.order_by(db.JobStep.exec_order.desc()):
            try:
                exec(step.body, globals(), locals())
            except Exception as e:
                logging.critical(f'Error while executing {step.key}')
                job.job_state = db.JobState.FAILED
                job.outcome = f'{e} @ {step.key}'
                job.save()
                raise
            logger.info(f'Step {step.key} done')
        job.outcome = json.dumps(lines)
        job.job_state = db.JobState.SUCCESS
        job.save()

    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
    }
