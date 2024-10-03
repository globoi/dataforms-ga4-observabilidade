constants.DATASET_PARTE5.forEach((tenant) => {
  
  const externalTable = {
    type: "declaration",
    database: 'gglobo-adtech-ga4-hdg-prd',
    schema: tenant,
    name: 'events_*',
  }
  declare(externalTable)

})
