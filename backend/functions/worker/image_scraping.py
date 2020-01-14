try:
    import unzip_requirements
except ImportError:
    pass

import asyncio
import logging
import os
import uuid
from urllib import parse


import aiohttp
import aiobotocore
import validators
import pandas as pd

from common import settings

logger = logging.getLogger()
logger.setLevel(logging.INFO)

RANDOM_SUFFIX_LENGTH = 5


def append_path(*paths):
    return "/".join(s.strip("/") for s in paths)


def image_static_url(path):
    host_url = settings.AWS_IMAGE_STATIC_URL
    return append_path(host_url, path)


def www_to_https(url: str) -> str:
    if url.startswith("www."):
        url = f"https://{url}"
    return url


def is_valid_url(url: str) -> bool:
    try:
        return validators.url(url)
    except TypeError:
        return False


def is_image_response(http_response) -> bool:
    try:
        ct = http_response.headers["Content-Type"].strip()
    except KeyError:
        raise ValueError("Content-Type header missing")
    return ct.startswith("image/")


def generate_available_filename(filename):
    suffix = uuid.uuid4().hex[:RANDOM_SUFFIX_LENGTH]
    base, ext = os.path.splitext(filename)
    return f"{base}_{suffix}{ext}"


async def fetch(session, url):
    try:
        response = await session.get(url, timeout=settings.IMAGE_SCRAPING_FETCH_TIMEOUT)
        response.raise_for_status()
        is_image_response(response)
    except (aiohttp.ClientError, ValueError):
        return None
    return response


async def upload(s3_client, path, http_response):
    return await s3_client.put_object(
        Bucket=settings.AWS_IMAGE_STORAGE_BUCKET_NAME,
        Key=path,
        Body=await http_response.read(),
        ACL="public-read",
        ContentDisposition="inline",
        ContentType=http_response.headers.get("Content-Type"),
        Metadata={"source": str(http_response.url)},
    )


async def fetch_and_upload_task(
    url, current_step, http_session, s3_client, dirpath="images"
):
    try:
        url = www_to_https(url)
        if not is_valid_url(url):
            return url
        http_response = await fetch(http_session, url)
        if http_response is None:
            return url
        parsed_url = parse.urlparse(url)
        filename = generate_available_filename(os.path.basename(parsed_url.path))
        path = os.path.join(
            f"{current_step.job.datasource.id}/jobs/{current_step.job.id}",
            dirpath,
            filename,
        )
        await upload(s3_client, path, http_response)
    except (asyncio.TimeoutError, aiohttp.ClientError):
        return url
    return image_static_url(path)


async def column_image_scraping(df, current_step, column):
    """Fetch images from url in the data frame column, upload them to s3 and return new image url"""

    boto_session = aiobotocore.get_session()
    async with boto_session.create_client(
        "s3", endpoint_url=settings.AWS_S3_ENDPOINT_URL
    ) as s3_client:
        async with aiohttp.ClientSession() as http_session:
            return await asyncio.gather(
                *(
                    fetch_and_upload_task(
                        url,
                        current_step=current_step,
                        http_session=http_session,
                        s3_client=s3_client,
                    )
                    for url in df[column]
                )
            )


def image_scraping(df, current_step, prefix="scrapped_"):
    columns = current_step.options.get("columns", [])
    for column in columns:
        processed_urls = asyncio.run(
            column_image_scraping(df=df, current_step=current_step, column=column)
        )
        df[f"{prefix}{column}"] = pd.Series(processed_urls)
