# Lapland UK - Harmony System

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies:

```bash
yarn
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`.\
The page auto-updates as you edit the file.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner jest in the interactive watch mode.\
See the section about [running tests](https://nextjs.org/docs/testing) for more information.

### `yarn build`

Builds the app for production to the `.next` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://nextjs.org/docs/deployment) for more information.

## Infrastructure

Harmony is deployed as a static website, with an AWS CloudFront distribution in front of an S3 bucket.
Built using terraform templates (see `/terraform` folder)

Will need AWS Credentials set up for the AWS account you're targeting
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables  
for more.

### M1 MacBook Issues
If the following error is encountered:

> Provider registry.terraform.io/hashicorp/template v2.2.0 does not have a package available for your current platform, darwin_arm64.

Install the `m1-terraform-provider-helper`:

```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
brew install kreuzwerker/taps/m1-terraform-provider-helper
m1-terraform-provider-helper activate
m1-terraform-provider-helper install hashicorp/template -v v2.2.0
```

Configure your AWS credentials e.g.:

```
export AWS_PROFILE="ticknovate-test"
```

switch to the correct workspace for the terraform state:
```
terraform workspace select test
```

Run the template into the environment with correct vars:

```
cd /terraform
terraform init
terraform plan -var-file="test.tfvars"
terraform apply -var-file="test.tfvars"
```

test/uat/prod workspaces and vars have been created.