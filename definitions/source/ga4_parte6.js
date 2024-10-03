constants.DATASET_PARTE6.forEach((tenant) => {
  
  const externalTable = {
    type: "declaration",
    database: 'gglobo-ga4-sites-inter-hdg-prd',
    schema: tenant,
    name: 'events_*',
  }
  declare(externalTable)

})
