# Metadata guidelines

You can use the `opendatahub.io/categories` field to define categories that users can use to find your application and/or its documentation, as shown here:

    metadata:
    name: create-jupyter-notebook-anaconda
    annotations:
        opendatahub.io/categories: 'Package management,Notebook environments'

Do not add your software or project name to "opendatahub.io/categories" field. If everyone adds their software or project as a category, the category list will become too long to be useful. Instead, mention your product in the short description or card title so that users can find you using the search bar.

Use the categories field to identify broader areas of concern for data scientists that your project can help solve, such as:

- Data analysis
- Data cleaning
- Data preprocessing
- Data management
- Data visualization
- Model training
- Model serving
- Model development
- Model monitoring
- Model optimization
- Notebook environments
- Package management

Additionally, use the `Getting started` category for content that helps a data scientist install, set up, and perform a simple proof-of-concept or verification task with your project, so that they can understand how they would use your project in their work.