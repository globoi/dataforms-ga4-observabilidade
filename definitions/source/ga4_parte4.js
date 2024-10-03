constants.DATASET_PARTE4.forEach((tenant) => {
  
  const externalTable = {
    type: "declaration",
    database: 'gglobo-ga4-hdg-prd',
    schema: tenant,
    name: 'events_*',
  }
  declare(externalTable)

})
