from aws_cdk.core import Construct
from aws_cdk.aws_ec2 import Vpc, InstanceType, InstanceSize, InstanceClass
from aws_cdk.aws_ecs import Cluster
from aws_cdk.aws_rds import DatabaseInstance, DatabaseInstanceEngine
from aws_cdk.aws_s3 import Bucket
from .code_commit import BaseCodeCommit

from .ecr import BaseECR
from config.base import EnvSettings


class BaseResources(Construct):
    code_commit: BaseCodeCommit = None
    ecr: BaseECR = None
    vpc: Vpc = None
    cluster: Cluster = None
    db: DatabaseInstance = None

    def __init__(self, scope: Construct, id: str, props: EnvSettings):
        super().__init__(scope, id)

        self.code_commit = BaseCodeCommit(self, "CodeCommit", props)
        self.ecr = BaseECR(self, "ECRBase", props)

        self.vpc = Vpc(self, "vpc", nat_gateways=1)
        self.cluster = Cluster(self, "worker-cluster", cluster_name="schema-ecs-cluster", vpc=self.vpc)

        self.db = DatabaseInstance(
            self,
            "db",
            master_username="root",
            database_name="gistdb",
            engine=DatabaseInstanceEngine.POSTGRES,
            storage_encrypted=True,
            allocated_storage=50,
            instance_class=InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
            vpc=self.vpc,
        )

        self.app_bucket = Bucket(self, "schemacms", versioned=True)
