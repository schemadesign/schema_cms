# -*- coding: utf-8 -*-
"""Click commands."""
import os
import logging
from glob import glob
from subprocess import call

from gist import extensions, app as app_module
from gist.user import models as user_models

import click

logger = logging.getLogger(__name__)

HERE = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(HERE, os.pardir)
TEST_PATH = os.path.join(PROJECT_ROOT, "tests")


@click.command()
@click.option(
    "--email",
    required=True,
    help="Superuser email.",
)
@click.option(
    '--password',
    prompt=True,
    confirmation_prompt=True,
    hide_input=True,
    required=True,
    help="Superuser password.",
)
@click.option(
    '-s',
    '--silent',
    default=True,
    is_flag=True,
)
def createsuperuser(email, password, silent):
    """Create superuser"""
    app = app_module.create_app()
    app.app_context().push()

    if extensions.db.session.query(extensions.db.exists().where(user_models.User.email == email)).scalar():
        logger.error('A user already exists!')
        exit(0 if silent else 1)

    user = user_models.User(
        email=email,
        is_admin=True,
        name='Administrator',
    )
    user.set_password(password)
    extensions.db.session.add(user)
    extensions.db.session.commit()
    logger.info('User added.')


@click.command()
def test():
    """Run the tests."""
    import pytest

    rv = pytest.main([TEST_PATH, "--verbose"])
    exit(rv)


@click.command()
@click.option(
    "-f",
    "--fix-imports",
    default=True,
    is_flag=True,
    help="Fix imports using isort, before linting",
)
@click.option(
    "-c",
    "--check",
    default=False,
    is_flag=True,
    help="Don't make any changes to files, just confirm they are formatted correctly",
)
def lint(fix_imports, check):
    """Lint and check code style with black, flake8 and isort."""
    skip = ["node_modules", "requirements", "migrations"]
    root_files = glob("*.py")
    root_directories = [
        name for name in next(os.walk("."))[1] if not name.startswith(".")
    ]
    files_and_directories = [
        arg for arg in root_files + root_directories if arg not in skip
    ]

    def execute_tool(description, *args):
        """Execute a checking tool with its arguments."""
        command_line = list(args) + files_and_directories
        click.echo("{}: {}".format(description, " ".join(command_line)))
        rv = call(command_line)
        if rv != 0:
            exit(rv)

    isort_args = ["-rc"]
    black_args = []
    if check:
        isort_args.append("-c")
        black_args.append("--check")
    if fix_imports:
        execute_tool("Fixing import order", "isort", *isort_args)
    execute_tool("Formatting style", "black", *black_args)
    execute_tool("Checking code style", "flake8")
