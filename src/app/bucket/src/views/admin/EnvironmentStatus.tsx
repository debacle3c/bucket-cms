import React from "react"

import { ConfigValidation } from "../../types"

const EnvironmentStatus = ({ configValidation }: { configValidation: ConfigValidation }) => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "unknown"
  const allMissing = !configValidation.hasAWSAccess && !configValidation.hasAWSSecret && !configValidation.hasAWSBucket && !configValidation.hasAWSRegion

  return (
    <>
      <div className="py-6 px-8 text-center bg-white rounded-lg shadow-md my-4 w-full max-w-[360px] mx-auto">
        <h2 className="text-xs mb-4">
          ENVIRONMENT
          <div className="text-xl font-bold">{hostname}</div>
          <p className="text-sm opacity-70 mt-2 mb-6 px-4 text-center">Looks like we need to configure environment variables.</p>
        </h2>
        <div className="flex items-center mb-2 ml-2">
          <span className={`px-2 py-1 rounded ${configValidation.hasAWSAccess ? "text-green-500" : "text-red-500 scale-90"}`}>{configValidation.hasAWSSecret ? "✅" : "❌"}</span>
          <span className="mr-2">AWS_ACCESS_KEY_ID</span>
        </div>
        <div className="flex items-center mb-2 ml-2">
          <span className={`px-2 py-1 rounded ${configValidation.hasAWSSecret ? "text-green-500" : "text-red-500 scale-90"}`}>{configValidation.hasAWSSecret ? "✅" : "❌"}</span>
          <span className="mr-2">AWS_SECRET_ACCESS_KEY</span>
        </div>
        <div className="flex items-center mb-2 ml-2">
          <span className={`px-2 py-1 rounded ${configValidation.hasAWSRegion ? "text-green-500" : "text-red-500 scale-90"}`}>{configValidation.hasAWSRegion ? "✅" : "❌"}</span>
          <span className="mr-2">AWS_REGION</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto my-16 px-8 prose">
        <h2 className="text-3xl font-bold opacity-80 mb-6">Connecting to AWS + S3</h2>
        <p className="mb-4">
          Environment variables are configurable key-value pairs that store private data like API keys, region specifications, and bucket names. Instead of hardcoding this sensitive information
          directly into the application code, which poses security risks and lacks flexibility, we use environment variables to inject these values into the application.
        </p>
        {allMissing && hostname == "localhost" && (
          <p>
            To configure local environment variables with Next.js, refer to{" "}
            <a className="underline text-blue-600" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables">
              their documentation
            </a>
            .
          </p>
        )}

        {!configValidation.hasAWSSecret && (
          <>
            <h3 className="text-2xl font-semibold opacity-70 mt-8 mb-4">Setting Up Your IAM User</h3>
            <p>
              To get started with Bucket CMS, the simplest way is to create an IAM (Identity and Access Management) user on AWS with the AmazonS3FullAccess policy attached. This policy grants full
              access to S3 services and resources. Bucket CMS is designed to run on your own server configuration and does not require any external access to function.
            </p>
            <ol>
              <li>
                <strong>Login to AWS Console: </strong>Sign into the{" "}
                <a className="underline text-blue-600" href="https://aws.amazon.com/">
                  AWS Management Console
                </a>{" "}
                and navigate to the{" "}
                <a className="underline text-blue-600" href="https://console.aws.amazon.com/iam/">
                  IAM dashboard
                </a>
                .
              </li>
              <li>
                <strong>Create a New IAM User:</strong> Click on “Users” in the navigation pane, and then the “Add user” button. Provide a user name and select “Programmatic access” for the access
                type.
              </li>
              <li>
                <strong>Attach the AmazonS3FullAccess Policy:</strong> In the permissions section, click “Attach existing policies directly.” Here, search and select the AmazonS3FullAccess policy.
              </li>
              <li>
                <strong>Review and Create:</strong> Review the details and hit “Create user.” Make sure to save the access key ID and secret access key, as you’ll need them to configure Bucket CMS.
              </li>
            </ol>
            <p>
              For more information on how to get your AWS Access Key and AWS Secret Access Key, refer to{" "}
              <a className="underline text-blue-600" href="https://aws.amazon.com/blogs/security/how-to-find-update-access-keys-password-mfa-aws-management-console/">
                this AWS article
              </a>
              . Once you have the secret, add it to the <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> environment variables (see below).
            </p>
          </>
        )}
        {!configValidation.hasAWSSecret && (
          <>
            <h3 className="text-2xl font-semibold opacity-70 mt-8 mb-4">AWS Access Key and AWS Secret Access Key</h3>
            <p>
              For information on how to get your AWS Access Key and AWS Secret Access Key, refer to{" "}
              <a className="underline text-blue-600" href="https://aws.amazon.com/blogs/security/how-to-find-update-access-keys-password-mfa-aws-management-console/">
                this AWS article
              </a>
              . Once you have the secret, add it to the <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> environment variables.
            </p>
          </>
        )}
        {!configValidation.hasAWSBucket && (
          <>
            <h3 className="text-2xl font-semibold opacity-70 mt-8 mb-4">AWS S3 Bucket</h3>
            <p>
              This CMS relies on the availability of a single AWS S3 Storage Bucket to store all data and file assets. Bucket CMS can create the bucket for you, just add a bucket name to to an
              <code>AWS_S3_BUCKET_NAME</code> environment variable.
            </p>
          </>
        )}
        {!configValidation.hasAWSRegion && (
          <>
            <h3 className="text-2xl font-semibold opacity-70 mt-8 mb-4">AWS Region</h3>
            <p>You can get the AWS region for your bucket from your S3 console. Add it to an AWS_REGION environment variable.</p>
          </>
        )}
      </div>
    </>
  )
}

export default EnvironmentStatus
