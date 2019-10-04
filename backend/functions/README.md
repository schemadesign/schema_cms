*How to update serverless function*
1. Install serverless framework:
```npm install -g serverless```
2. Install serverless plugins like `serverless-python-requirements`:
```serverless plugin install -n serverless-python-requirements```
3. Go to lambda function directory
4. Create package:
```serverless package```
It will create `.serverless` directory with `.zip` file that will be used to deploy lambda function
