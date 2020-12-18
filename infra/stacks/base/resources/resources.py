from aws_cdk.aws_ec2 import Vpc, InstanceType, InstanceSize, InstanceClass
from aws_cdk.aws_ecs import Cluster
from aws_cdk.aws_rds import DatabaseInstance, DatabaseInstanceEngine
from aws_cdk.core import Construct, CfnOutput

from config.base import EnvSettings
from .ecr import BaseECR
from .kms import BaseKMS


class BaseResources(Construct):
    ecr: BaseECR = None
    key: BaseKMS = None
    vpc: Vpc = None
    cluster: Cluster = None
    db: DatabaseInstance = None

    def __init__(self, scope: Construct, id: str, envs: EnvSettings):
        super().__init__(scope, id)

        self.ecr = BaseECR(self, "ECR", envs)

        self.key = BaseKMS(self, "KMS", envs)

        self.vpc = Vpc(self, "Vpc", nat_gateways=1)

        self.cluster = Cluster(self, "WorkersCluster", cluster_name="schema-ecs-cluster", vpc=self.vpc)

        self.db = DatabaseInstance(
            self,
            "DataBase",
            database_name=envs.data_base_name,
            engine=DatabaseInstanceEngine.POSTGRES,
            storage_encrypted=True,
            allocated_storage=50,
            instance_type=InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
            vpc=self.vpc,
        )

        if self.db.secret:
            CfnOutput(
                self,
                id="DbSecretOutput",
                export_name=self.get_database_secret_arn_output_export_name(envs),
                value=self.db.secret.secret_arn,
            )

    @staticmethod
    def get_database_secret_arn_output_export_name(envs: EnvSettings):
        return f"{envs.project_name}-databaseSecretArn"
