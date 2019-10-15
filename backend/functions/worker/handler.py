import json
import logging
import sys
from io import StringIO

import db
import datatable as dt
import settings
import services
import mocks

logger = logging.getLogger()
logger.setLevel(logging.INFO)


df = None
db.initialize()


def write_dataframe_to_csv_on_s3(dataframe, filename):
    csv_buffer = StringIO()

    dataframe.to_csv(csv_buffer, index=False)

    return services.s3_resource.Object(
        settings.AWS_STORAGE_BUCKET_NAME, filename
    ).put(Body=csv_buffer.getvalue())


def main(event, context):
    """Invoke with
    python mocks.py <JobID> | sls invoke local --function main --docker --docker-arg="--network host"
    """

    logger.info(f'Incoming event: {event}')

    global df

    for record in event['Records']:
        body = json.loads(record['body'])
        job_pk = body['job_pk']

        try:
            job = db.Job.select().join(db.JobStep).switch(db.Job).join(db.DataSource).where(
                (db.Job.id == job_pk) & (db.Job.job_state == 'pending')
            ).get()
        except Exception as e:
            logging.critical(f"Unable to get job from db - {e}")
            raise

        job.job_state = db.JobState.IN_PROGRESS
        job.save()

        source_file = services.s3.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=job.datasource.file.lstrip("/")
        )

        try:
            df = dt.fread(source_file["Body"], fill=True).to_pandas()
        except Exception as e:
            logging.critical(f'Error while loading source file - {e}')
            job.job_state = db.JobState.FAILED
            job.error = f'{e} @ loading sorurce file'
            job.save()
            raise

        for step in job.steps.order_by(db.JobStep.exec_order.desc()):
            try:
                logging.info(f'Script **{step.script.name}** is running.')
                exec(step.body, globals())
            except Exception as e:
                logging.critical(f'Error while executing {step.script.name}')
                job.job_state = db.JobState.FAILED
                job.error = f'{e} @ {step.id}'
                job.save()
                raise
            logger.info(f'Step {step.id} done')

        result_file_name = f"{job.datasource.file.rstrip('.csv')}_Job#{job.id}_result.csv"
        write_dataframe_to_csv_on_s3(df, result_file_name.lstrip("/"))

        job.result = result_file_name
        job.error = ""
        job.job_state = db.JobState.SUCCESS
        job.save()

    return {
        "message": "Your function executed successfully!",
    }


if __name__ == "__main__":
    main(mocks.get_simple_mock_event(sys.argv[1]), {})
