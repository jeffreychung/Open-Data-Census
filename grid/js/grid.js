 $(document).ready(function() {
     Tabletop.init({
         key: "1OhVbryeHBsPjJ3TjjVFlfM552pDKRjiUpTAXQJe9miA",
         callback: showInfo,
         parseNumbers: true
     });
 });


 var rawData = [];

 function showInfo(data, tabletop) {

     var departmentTemplate = Handlebars.compile($("#department-template").html());

     rawData = tabletop.sheets("Completed Grid Data").all()
     var allTypes = _.chain(rawData).map(function(row) {
             return row["Type of Data"]
         })
         .unique()
         .value();


     setupDatatypes(allTypes);

     var rows = _.chain(rawData)
         .groupBy("City")
         .map(function(datasets, department) {
             var row = {
                 department: department,
                 state: datasets[0]["State"],
                 departmentHref: URI().filename("datasets.html").search({
                     "department": department
                 }).toString(),
                 datasets: []
             }

             _.each(allTypes, function(type) {
                 var foundDataset = _.find(datasets, function(dataset) {
                     return dataset["Type of Data"] === type;
                 })
                 if (foundDataset) {
                     var gridData = {
                         exists: foundDataset["Exists],

                         online: foundDataset["Available online"],

                         machine: foundDataset["Machine readable"],

                         bulk: foundDataset["Available in bulk"],

                         openLicense: foundDataset["No restrictions"],

                         fresh: foundDataset["Up-to-date"],

                         inRepo: foundDataset["In the state repository"],

                         verifiable: foundDataset["Verifiable"],

                         complete: foundDataset["Complete"],

                         datasetHref: URI().filename("datasets.html").search({
                             "department": row["department"],
                             "datatype": foundDataset["Type of Data"]
                         })
                     }

                     gridData.existsCaption = captions.exists[gridData.exists]; 
                     gridData.onlineCaption = captions.online[gridData.online];
                     gridData.machineCaption = captions.machine[gridData.machine];
                     gridData.bulkCaption = captions.bulk[gridData.bulk];
                     gridData.openLicenseCaption = captions.openLicense[gridData.openLicense];
                     gridData.freshCaption = captions.fresh[gridData.fresh];
                     gridData.inRepoCaption = captions.inRepo[gridData.inRepo];
                     gridData.verifiableCaption = captions.verifiable[gridData.verifiable];
                     gridData.completeCaption = captions.complete[gridData.complete];
                     row["datasets"].push(gridData).toString()
                 } else {
                     row["datasets"].push({
                         exists: "DNE",
                         online: "DNE",
                         machine: "DNE",
                         bulk: "DNE",
                         openLicense: "DNE",
                         fresh: "DNE",
                         inRepo: "DNE",
                         verifiable: "DNE",
                         complete: "DNE",
                         datasetHref: "http://goo.gl/forms/WdJHdBmVLQ"
                     });
                 }
             });
             return row;
         })
         .sortBy("department")
         .each(function(row) {
             var html = departmentTemplate(row);
             $("#departments").append(html);
         })

     .value();

     $('[data-toggle="tooltip"]').tooltip()
 }




 function setupDatatypes(allTypes) {
     var datatypes = _.chain(allTypes).map(function(type) {
             return {
                 "datatype": type,
                 "datatypeHref": URI().filename(type.replace(/ /g, '') + ".html").toString()
             }
         })
         .unique()
         .value();
     var datasetTemplate = Handlebars.compile($("#dataset-template").html());
     var datasetHtml = datasetTemplate(datatypes);
     $("#datasets").append(datasetHtml);
 }