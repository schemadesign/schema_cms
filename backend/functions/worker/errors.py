class JobLoadingSourceFileError(Exception):
    pass


class JobSavingFilesError(Exception):
    pass


class JobSetExecutionError(Exception):
    def __init__(self, msg, step, *args):
        self.msg = msg
        self.step = step
        super().__init__(*args)
