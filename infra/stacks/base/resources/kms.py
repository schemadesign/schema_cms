from aws_cdk.core import CfnOutput, Construct
from aws_cdk.aws_kms import Key

from aws_cdk.aws_iam import AccountRootPrincipal, PolicyStatement


class BaseKMS(Construct):
    key: Key = None

    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        self.key = Key(self, id="Key", alias="alias/schema-cms")

        self.key.add_to_resource_policy(
            PolicyStatement(
                actions=["kms:Encrypt", "kms:Decrypt"], principals=[AccountRootPrincipal()], resources=["*"]
            )
        )

        CfnOutput(
            self, "KmsKeyArnOutput", export_name=self.get_kms_arn_output_export_name(), value=self.key.key_arn
        )

    @staticmethod
    def get_kms_arn_output_export_name():
        return "schema-cms-kmsKeyArn"
