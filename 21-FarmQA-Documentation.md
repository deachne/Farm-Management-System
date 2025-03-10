# FarmQA Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started with FarmQA](#getting-started-with-farmqa)
3. [FarmQA Mobile Scouting App](#farmqa-mobile-scouting-app)
4. [Soil Sampling in FarmQA](#soil-sampling-in-farmqa)
5. [FarmQA Analytics](#farmqa-analytics)

## Introduction

This documentation provides an overview of the FarmQA platform, a comprehensive farm management system designed to help agricultural professionals manage their operations more efficiently. FarmQA offers a range of features including field management, crop scouting, soil sampling, analytics, and more.

The documentation is organized into sections covering the main components of the FarmQA system, with step-by-step instructions for common tasks and workflows.

## Getting Started with FarmQA

Use this guide to help set up your FarmQA account and get started with the platform.

### Creating an Enterprise in FarmQA

1. Go to the [FarmQA login page](https://controller.farmqa.com/) and click the **Sign up now** button.
2. Enter your **Name** and **Email address** in the dialog box, then press the **Next** button.
3. An email will be sent to the email address you provided containing your **login code**. Enter the code and click the **Next** button.
4. Enter the **name** of your company, organization, or operation that you want to use for your FarmQA account.
5. Set the **unit of measure** that you want used in your account (Imperial or Metric).
6. Select the **role** you have within your organization.
7. Choose the **crops** that you'd like to have in your account.
8. Set and confirm the **password** for your account.
9. Review your account information and click the **Submit** button to finish setting up your account.

### Adding Users

1. Click on the **Settings** icon, then click on the **Users** tab.
2. Click the **Add new user** button.
3. Fill out the **Email**, **Name**, and set the **Password** for the user.
4. Assign the new user to an **Organization** and give them a **Role**, then **Save** the new user.

### Adding Levels to Your Organization

1. In the FarmQA web app, click on the **Settings** icon then go to the **Organization** tab.
2. In your organization tree, click on the level of your organization you want to add a level under, then click the blue **Add** button at the bottom of the screen.
3. Enter the name of your new organization level in the **Add an organization** window, then press **Save**.

**NOTE:** By default, the only type of organization you're allowed to add in your account are **Farms**. If you'd like to add different organization types, like **Growers** or **Consultants**, contact the FarmQA support team for assistance.

### Setting Up Crop Varieties

1. Click on the **Settings** icon, then find the **Crops/varieties** tab.
2. Click on the **Add variety** button in the desired crop row.
3. Set the **variety name**, then click the **Add variety** button to save your changes.

### Adding Field Boundaries

There are two ways to add your field boundaries to FarmQA:

1. **Draw** your fields within FarmQA Controller/Scouting:
   - In the **Map** tab, open the slide-out map pane and click the **Create fields** button.
   - Click on the **Add polygon** button and draw the outline of your field.
   - Assign the field to an **Organization** and give it a **Name**, then **Save** your new field.

2. Send your field shapefiles to the FarmQA support staff to **import** your shapefiles.

### Assigning Crops/Varieties to Fields

1. Click on the **Fields** icon.
2. Check the boxes on the left-hand side of the field rows you want to add the crop to.
3. Click the **Assign a crop** icon and select the crop/variety you want to assign.
4. Click the **Assign** button to save your changes.

### Edit a Scouting Template

1. Click on the **Scouting** icon, then go to the **Templates** tab.
2. Click on the name of the scouting template you wish to edit.
3. Within your template, you can Add, **Delete**, and **Edit** sections and questions to match your needs.
4. When you've finished your changes, click the **Save** icon to update your template.

### Assigning Scouting Templates to Crops

1. Click on the **Settings** icon, then find the **Crops/varieties** tab.
2. Find the **Crop** or **Variety** you want to add a template to, then click the **Edit** button on the right-hand side of that crop or varieties row.
3. In the **Template** column, use the dropdown menu to find the template you want to associate with that crop/variety.
4. Click the checkmark to save your changes.

### Adding Products

Chemical products can be added to your account to help with writing recommendations:

1. Click on the **Advice** icon, then find the **Products** tab.
2. Click on the **New product** dropdown menu then select the **+ Import from EPA** option.
3. Use the search bar to search for a product by its **label name** or **active ingredients**.
4. Click the **Add Products** button when you're done.

### Creating a Chemical Mix

1. Click on the **Advice** icon, then find the **Mixes** tab.
2. Click the **New mix** button to start making your mix.
3. Click the **Add products** button to start adding products from your product list to your mix. Click the **Add** button once you've selected all the products you want to add.
4. Give your mix a name, then click the **Save mix** button to save your mix.

### Write a Recommendation

1. Click the **Action** button, then choose the **Create a recommendation** option.
2. Associate your recommendation with a **Field(s)**, then add a **mix** or **product(s)** to your recommendation.
3. Click **Save draft** if you want to come back and finish your recommendation later or press the **Submit** button if you're ready to send your recommendation off.

## FarmQA Mobile Scouting App

The FarmQA mobile scouting app is a flexible and powerful tool that you can use to scout and manage your fields. This section covers how to get the app set up on your mobile device, navigate the app, and use its basic functionality.

### Downloading/Accessing the FarmQA Mobile App

The FarmQA mobile app is available on Apple mobile devices running iOS or iPadOS 12.0 and newer and Android devices running Android OS 8.1 or newer.

#### iOS (Apple) Device Requirements
- iOS/iPadOS version 12.0 or later
- Minimum of 2 GB of RAM (4 GB is recommended)
- Download link: [FarmQA Scouting on the App Store](https://apps.apple.com/us/app/farmqa-scouting/id1232043703)

#### Android Device Requirements
- Android OS 8.1 (Oreo) or later
- Minimum of 2 GB of RAM (4 GB is recommended)
- Download link: [FarmQA Scouting on Google Play](https://play.google.com/store/apps/details?id=com.farmqa.scouting&hl=en_US&gl=US)

#### Access via Mobile Web Browser
You can also access the FarmQA mobile app from your mobile web browser:
- Open your preferred mobile web browser (Safari for iOS or Google Chrome for Android)
- Go to: [scouting.farmqa.com](https://scouting.farmqa.com/)
- Log in to your FarmQA account

**Note:** When using the web browser version, the following limitations apply:
- Your GPS location will NOT be available
- Photo capture will NOT be available
- You will NOT be able to scout offline

### Navigating the FarmQA Mobile App

After logging in to your FarmQA account from the mobile app, you'll find six main pages:

#### Fields
The Fields page has two tabs:
- **MAP tab**: Displays a map of all your fields in the current organization level
- **LIST tab**: Displays all fields as a list, which can be sorted by:
  - Distance from your current location
  - Name in alphabetical order
  - Crop assigned to the field
  - Plant date
  - Harvest date
  - Harvest amount
  - Most recent Scouted date
  - Most recent Recommendation date

Map view features:
- Slide-out map pane for overlay and imagery options
- Base layer selection
- Township section line overlay option
- Field color options (by Crop, Varieties, Farms, or Task)
- Global map layers access
- Zoom controls and location tracking

#### Scouting
The Scouting tab is split into two main sections:
- **In-progress reports**: Reports that have been started but not submitted
- **Past reports**: Reports that have been submitted

Actions available:
- Delete in-progress reports
- Submit in-progress reports
- Export past reports to PDF
- Search for reports by field name, farm, or crop
- Filter past reports by date
- Sort past reports by date, field, organization, etc.
- Start new batch or ad hoc scouting reports

#### Advice
The Advice tab is split into two main sections:
- **In-progress recommendations**: Recommendations that have been started but not submitted
- **Past recommendations**: Recommendations that have been submitted

Actions available:
- Delete in-progress recommendations
- Submit in-progress recommendations
- Filter past recommendations by date
- Export past recommendations to PDF
- Mark recommendations as Complete or In-progress
- Search for recommendations by field name, farm, or crop

#### Work
The Work tab allows you to:
- Filter tasks assigned to you or view all tasks
- Sort tasks by finish date, task type, priority, etc.
- Create new tasks

#### Learn
The Learn page provides access to resources about using FarmQA, including:
- Video tutorials
- Support articles
- Information about different FarmQA features

#### Settings
The Settings page allows you to:
- Sync your app with your main FarmQA account
- Configure layer sync preferences
- Set up geomarker preferences
- Access learning resources
- Toggle options like:
  - Upload pictures on WiFi only
  - Save pictures to photo library
  - Offline mode

### Filling Out a Scouting Report

1. In the **Fields** page, locate a field you'd like to scout.
2. Click on the field, then click on it a second time and select **Add observation** in the menu that appears.
3. Click on the various headers in the scouting report template to record the necessary information.
4. When you're done, click on the green **Submit** button in the bottom right-hand corner of the screen.

### Adding Pictures or Map Drawings to Observations

1. Start filling out a scouting report.
2. After making an observation, click on the **Edit** button next to the question.
3. Choose one of the following options:
   - **Draw on map** to add a point or draw on the map
   - **Take Picture** to take a photo corresponding to your observation
   - **Reset Question** to delete your observation and start over

When using the **Draw on map** function, you can:
- Draw vertices to outline your observation
- Draw a polygon for more complex shapes
- Draw a circle
- Place a pin at the location of your observation

### Resuming an In-Progress Report

1. Click on the **Scouting** icon, then locate the report you'd like to continue in the **IN PROGRESS REPORTS** section.
2. You can search for reports by entering the assigned crop, farm, or field.

### Starting an Ad Hoc Report

1. Click the blue **Add** button in the bottom right-hand corner of the screen, then click the **New ad hoc scouting report** button.
2. Complete the setup steps:
   - Input the **Field name(s)** of the field(s) you're scouting
   - Select the **Template** you want to use
   - Choose the **Farm/Organization** where the report will be stored
3. Click the **Start** button.
4. Your ad hoc report will be associated with your current location. Click the blue **Add** button and select **Add observation** to begin recording observations.

## Soil Sampling in FarmQA

This section outlines the complete workflow for soil sampling in FarmQA, from setting up your account to uploading and analyzing soil sample data.

### Navigate to a Field

Available in the: **Mobile App**
User permissions: **All Users**

1. In the **Fields** page, locate and click on the field you want to navigate to.
2. Click the **More actions** button then click **Route to** button.
3. You'll be redirected to your desired mobile direction application.

### Access Existing Soil Sample Geomarkers

Available from the: **Mobile App**
User Permissions: **All Users**

1. In the **Fields** page, click on the field you want to sample.
2. Swipe up on the white rectangular bar at the bottom of the screen and click the button next to **Soil samples**.
3. Your soil sample geomarkers should now be displayed within the field.

### Setting Soil Sample Geomarkers

Available from the: **Mobile App**
User permissions: **Enterprise Administrator, Agronomist**

1. In the **Fields** tab, click on the field you're collecting soil samples for.
2. Click on the location where you want to add your soil sample geomarker, then click the **Drop marker at location** button.
3. Select **Soil sample** for the geomarker type, give the marker a name/ID, then click **SAVE MARKER**.
4. Your soil sample geomarker will now appear in the field.

### Collecting Soil Samples

Available from the: **Mobile App**
User permissions: **Enterprise Administrator, Agronomist, Grower, Standard, Crop Scout**

1. In the **Fields** tab, click on the field you want to collect soil samples for.
2. After you've selected the field, click anywhere on the field then click the **Collect soil samples** button.
3. If you have any pre-existing soil sample geomarkers, you can turn them on by clicking on the **Layer** button, then selecting the geomarker layer that contains your soil samples.
4. While sampling, click on the location on the map where you're collecting a sample. The FarmQA mobile app will automatically open the barcode scanner so you can scan the barcode on your sample bag.
5. Once your barcode has been scanned, a tracking line to the nearest soil sample to you and the distance to it will be updated and displayed.

### Change a Field from Not Sampled to Sampled

Available from the: **Mobile App**
User Permissions: **Enterprise Administrator, Agronomist, Grower**

**NOTE:** You can only complete these steps if you have set up your growing season to have Sampled and Not Sampled crops.

1. In the **Fields** tab, click on the field you just collected soil samples for.
2. Click the **More options** button, then click **Change crop/variety**.
3. Change the crop assignment for the field from **Not Sampled** to **Sampled** and then click the **SET CROP/VARIETY** button. Your crop assignment will be updated, and your field's color will change accordingly.

### Coloring Your Fields Based on Whether They've Been Sampled or Not

Available from the: **Web App**
User permissions: **Enterprise Administrator**

1. Click on **Settings**, then go to the **Growing seasons** tab.
2. At the bottom of the screen, click the blue **Add** button, and select **New growing season**.
3. Name the growing season **Soil Sampling** and set the state to **Active**. Press the **Save** button.
4. In the upper right-hand corner of the screen, use the growing season dropdown menu to set the growing season you're viewing to **Soil Sampling**.
5. Go to the **Crops/varieties** tab. Delete any existing crops in your **Soil Sampling** growing season.
6. Click the **Add New Crop** button and create two new crops:
   - Name: **Sampled** or **Not Sampled**
   - Master crop: Other
   - Template: choose any template in your account
   - Map color: red for **Not Sampled** and green for **Sampled**
7. Go to the **Fields** tab and use the **Items per page** dropdown to display all your fields.
8. Check the box at the upper left-hand corner to select all fields, then click **Assign a crop** and assign all fields to the **Not Sampled** crop.
9. In the **Map** view, set the **FIELD COLOR** to **Color by crop** to see your field coloring.

### Setting Up an Integration with AgVise Laboratories

Available from the: **Web App**
User permissions: **Enterprise Administrators**

1. Log in to your AgVise Laboratories account.
2. Go to **Settings > API Settings** and copy your API Key.
3. In your FarmQA account, go to **Soil > Labs** and copy your API key into the **AGVISE API Key** text box.

### Creating a Soil Sample Import Profile

Available from the: **Web app**
User permissions: **Enterprise Administrator, Agronomist**

1. Click on the **Soil** icon, then go to the **Settings** tab.
2. Click the **Add** button next to **IMPORT PROFILE** to create a new import profile.
3. In the **Soil Import Profile** window, either click inside the window or drag the **.CSV** file containing your soils data into the import window.
4. Fill out the following information:
   - The **Name** for your import profile
   - The columns containing the **Grower**, **Field**, and **Sample ID** information
   - The **Date** column if available
5. Click the **Next** button.
6. Check the boxes next to the columns that contain soils data you want to import, then click **Next**.
7. Complete the final setup:
   - Select **Soil properties** from the dropdown menu for each column
   - Verify the **Unit of measure** is correct
   - Set the **Depth** interval for each sample
   - Assign **Metrics** if desired
8. Click the **Save** button to finish setting up your soil import profile.

### Import Your Soil Data to FarmQA

Available from the: **Web App**
User permissions: **Enterprise Administrator, Agronomist**

1. Click on the **Soil** icon, then make sure you're in the **Samples** tab.
2. Click the **Import soil data** icon and select the soil import profile you want to use.
3. Fill out the information in the **Upload soil samples** window:
   - Select the enterprise branch to import into
   - Choose the growing season
   - Pick the geomarker type (Soil sample)
   - Set the sample date
4. Upload your soil sample **.CSV** file by clicking within the window or dragging the file into it.
5. Your soils data will be uploaded and viewable within your FarmQA account.

### Viewing Your Soils Data

Available from the: **Web App**
User permissions: **All Users**

1. Click on the **Soils** icon, then make sure you're in the **Samples** tab.
2. Use the fields menu on the left-hand side to locate the field you want to view data for.
3. Sort and display your data by clicking one of the following options:
   - **Locations by row**: Samples listed by location
   - **Nutrients by row**: Samples listed by soil nutrient
   - **Samples list**: Individual samples listed in rows
4. Sort data using the **View by** option (Day, Week, Month, or Year).
5. Filter previous years' data using the **Filter** option in the **Samples list** view.

### Turn Sample Locations into Soil Geomarkers

Available from the: **Web App**
User permissions: **Enterprise Administrator, Agronomist, Grower, Standard, Crop Scout**

1. Click on the **Soil** icon, then make sure you're in the **Samples** tab.
2. Click on the field you want to turn your sampling points into geomarkers for.
3. Click the **Turn samples into permanent markers** button.

### Exporting Your Soils Data from FarmQA

Available from the: **Web App**
User permissions: **All Users**

To export data for a single field:
1. Click on the **Soils** icon, then select the field you want to export data for.
2. Click the **Excel** button above your data table to export your data to a .CSV file.
3. To include sample locations, click on the **Samples list** option, then click on the **Columns** dropdown and select **Latitude** and **Longitude**.

To export data for multiple fields:
1. Click on the **Soils** icon, then click on the **Multi-select** icon at the top of the screen.
2. Hover your cursor over the fields you want to export points from, then click the **Add to cart** button.
3. When you've selected all the fields, click on the **Show** button at the top of the screen.
4. Click **CSV file** to export your data to a spreadsheet, or click the **Shape file** button to export your sampling locations.

## FarmQA Analytics

FarmQA Analytics allows you to bring in and visualize metric data from various sources within your FarmQA account. This section covers how to create metrics, set up visualizations, and build dashboards to gain insights from your farm data.

### Creating a New Metric

Available from the: **Web App**
User permissions: **Agronomist and up**

1. Log in to your FarmQA account from the web app.
2. Click on the **Analytics** icon, then go to the **Metrics** tab.
3. Click the blue **+ New Metric** button at the top of the screen.
4. Select the type of metric data you'll be bringing in:
   - **Picklist**: Data categorized by preset values (e.g., Low, Medium, High)
   - **Numeric**: Generic numeric data values (e.g., a scale of 1-10)
   - **Numeric distribution**: Similar to numeric but for distribution analysis
5. Fill in the following information:
   - **Name**: What you want to call your metric
   - **Category**: Term to categorize your metrics (e.g., Soil, Weather, Crop Health)
   - **Unit of measure**: The unit for your data (can be left blank)
   - **Sources**: Select where your metric data will be collected from
   - **Range**: For numeric metrics, set the value range for color scaling
6. Set the **Colors** that will be used to visualize your numeric data using the dropdown menu.
7. Click the **Save** icon to save your new metric.

### Editing an Existing Metric

Available from the: **Web App**
User permissions: **Agronomist and up**

1. Click on the **Analytics** icon, then go to the **Metrics** tab.
2. Find the metric you want to edit by scrolling through the list on the left-hand side.
3. Click on the metric and make your desired changes.
4. Click the **Save** icon to update the metric.

### Creating Metric Visualizations

Available from the: **Web App**
User permissions: **Agronomist and up**

1. Click on the **Analytics** icon, then go to the **Visualizations** tab.
2. Click the blue **+ New Visualization** button at the top of the screen.
3. Select the type of visualization you want to create:
   - **Map**: Display data geographically on your field maps
   - **Chart**: Create line, bar, or other chart types
   - **Table**: Display data in a tabular format
4. Fill in the following information:
   - **Name**: What you want to call your visualization
   - **Metric**: Select the metric you want to visualize
   - **Filters**: Set any filters to narrow down the data displayed
   - **Time range**: Set the time period for your data
5. Configure the visualization-specific settings:
   - For maps: select base layer, color scheme, etc.
   - For charts: select chart type, axes, labels, etc.
   - For tables: select columns, sorting, etc.
6. Click the **Save** icon to save your visualization.

### Setting Up Dashboards

Available from the: **Web App**
User permissions: **Agronomist and up**

1. Click on the **Analytics** icon, then go to the **Dashboards** tab.
2. Click the blue **+ New Dashboard** button at the top of the screen.
3. Give your dashboard a name and description.
4. Click the **Add Visualization** button to add visualizations to your dashboard.
5. Select the visualizations you want to include from the list of available visualizations.
6. Arrange the visualizations on your dashboard by dragging and dropping them.
7. Resize visualizations by dragging the corners.
8. Click the **Save** icon to save your dashboard.

### Viewing Your Data Outside of the Analytics Tab

FarmQA Analytics allows you to view your metric data in other parts of the application:

#### Viewing Analytics Data in the Fields Tab

1. Click on the **Fields** icon to go to the Fields page.
2. Click on a field to view its details.
3. In the field details panel, you'll see a section for Analytics data if available.
4. Click on a metric to view its data for the selected field.

#### Viewing Analytics Data in the Map View

1. Click on the **Map** icon to go to the Map view.
2. Use the layer controls to add Analytics layers to your map.
3. Select the metric you want to display from the available Analytics layers.
4. The map will update to show the selected metric data across your fields.

### Displaying Spray Events in Metric Visualizations

FarmQA Analytics can display spray events in your metric visualizations to help you correlate applications with field outcomes:

1. Create or edit a metric visualization.
2. In the visualization settings, enable the **Show spray events** option.
3. Select which types of spray events you want to display.
4. Save your visualization.

Spray events will appear as markers on your charts or maps, allowing you to see when applications were made relative to your metric data.

### Exporting Analytics Data

1. Navigate to the visualization or dashboard you want to export.
2. Click the **Export** button in the top right corner.
3. Select your desired export format:
   - **PDF**: For reports and presentations
   - **CSV**: For data analysis in spreadsheet software
   - **Image**: For including in other documents
4. Configure any export-specific options.
5. Click **Export** to download the file. 