from aws_cdk.core import CfnOutput, Construct
from aws_cdk.aws_kms import Key

from aws_cdk.aws_iam import AccountRootPrincipal, PolicyStatement

from config.base import EnvSettings


class BaseKMS(Construct):
    key: Key = None

    def __init__(self, scope: Construct, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.key = Key(self, id="Key", alias=f"alias/{envs.project_name}")

        self.key.add_to_resource_policy(
            PolicyStatement(
                actions=["kms:Encrypt", "kms:Decrypt"], principals=[AccountRootPrincipal()], resources=["*"]
            )
        )

        CfnOutput(
            self,
            "KmsKeyArnOutput",
            export_name=self.get_kms_arn_output_export_name(envs),
            value=self.key.key_arn,
        )

    @staticmethod
    def get_kms_arn_output_export_name(envs):
        return f"{envs.project_name}-kmsKeyArn"
