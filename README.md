# Spirio Frontend - UX/UI Development Version

A Next.js-based frontend application for spiritual guidance and consultation services.

## 🎨 UX/UI Development Focus

This version has been prepared specifically for UX/UI analysis and development work. All business-critical logic and sensitive data have been secured.

## General info

The project is written in React.JS, Next.js and Typescript.

## Development

### Instalation

```bash
npm i
```

---

### Run the development server

```bash
npm run dev
```

### Tools recommendations

As data fetching library use [SWR](https://swr.vercel.app/).

For handling forms use [Formik](https://formik.org/) with [Yup validation schemas](https://formik.org/docs/guides/validation#validationschema).

For images use Next.js native [Image component](https://nextjs.org/docs/api-reference/next/image).

## Application documentation

Source files are located in [./docs/application_documentation.md](./docs/application_documentation.md).

## Provision

```sh
# production provision

make production

# staging provision

make staging

# development provision

make development

# local provision

make local

# testing provision

make testing
```

## Release

To release the project to production, follow these steps.

### Set Up the Server

Set up a new server with Ubuntu 22.04.

Configure the required DNS records to point to this server.

### Deploy the Project

Log in to the server as a non-root user.

Clone the project into the desired directory.

Ensure that the ownership of the folders, supervisors, crontabs and files is assigned to the non-root user.

### Configure the Environment

Follow the [./docs/application_documentation.md](./docs/application_documentation.md) to install the required dependencies and software.

### Set Up the .env File

Copy the `/.env.example` file to create the basic structure of the `/.env` file.

Modify the `/.env` file to include all necessary environment variables according to the application documentation.


### Deploy to Production

Run the following command to deploy to the production environment.

```sh
make production
```

This command will execute the provisioning and deploy the application to the production environment.

### Verify the Deployment

Ensure that the application is running correctly by checking the logs and the status of the services.
