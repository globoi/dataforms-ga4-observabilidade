publish(`ga4_parte2`, {
    type: "incremental",
    schema: "ga4_observabilidade"
}).query(ctx => {
    const tenantQueries = constants.DATASET_PARTE2
        .map(datasetGA4 => {
            let day_r = 1;


            const ga4_query = `

(WITH total_hit as (

  (SELECT 
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  COUNT(*) total_hits
  FROM ${ctx.ref(datasetGA4, "events_*")}
  WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)))
  group by 1,2,3
)),

 page_view as (
SELECT
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  COUNT(*) AS page_views
  FROM ${ctx.ref(datasetGA4, "events_*")}
  WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND event_name = "page_view"
  group by 1,2,3
), 

 screen_view as (
SELECT
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  COUNT(*) AS screen_views
  FROM ${ctx.ref(datasetGA4, "events_*")}
  WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND event_name = "screen_view"
  group by 1,2,3
), 

 logged_user as (
  SELECT  
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  COUNT( DISTINCT(SELECT up.value.string_value  FROM UNNEST(user_properties) AS up WHERE up.key = "user_code")) logged_users
  FROM ${ctx.ref(datasetGA4, "events_*")}
   WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND event_name IN ("page_view", "screen_view") AND (SELECT up.value.string_value  FROM UNNEST(user_properties) AS up WHERE up.key = "user_code_provider") IN ("cadun", "oidc")
group by 1,2,3
),

 not_logged_user as (
  SELECT  
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  COUNT( DISTINCT(SELECT up.value.string_value  FROM UNNEST(user_properties) AS up WHERE up.key = "user_code")) not_logged_users
  FROM ${ctx.ref(datasetGA4, "events_*")}
   WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND event_name IN ("page_view", "screen_view") AND (SELECT up.value.string_value  FROM UNNEST(user_properties) AS up WHERE up.key = "user_code_provider") NOT IN ("cadun", "oidc")
group by 1,2,3
),



 video_start as (
  
  SELECT   
    DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
    platform,
    (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
    COUNT(*)  video_views
  FROM ${ctx.ref(datasetGA4, "events_*")}
  WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND event_name = "video_start" 
  group by 1,2,3
  
),

 video_playtime as (
  (SELECT 
    DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
    platform,
    (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
    SUM(if((SELECT COALESCE(ep.value.int_value, ep.value.float_value, ep.value.double_value) 
        FROM UNNEST(event_params) AS ep 
        WHERE ep.key = "video_playtime")>60,60,(SELECT COALESCE(ep.value.int_value, ep.value.float_value, ep.value.double_value) 
        FROM UNNEST(event_params) AS ep 
        WHERE ep.key = "video_playtime"))) video_playtimes
   FROM ${ctx.ref(datasetGA4, "events_*")}
   WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) AND (event_name IN ("video_pause", "video_milestone") 
          )
  group by 1,2,3) 
), total_session as (

SELECT
  DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY)) AS date,
  platform,
  (SELECT ep.value.string_value FROM UNNEST(event_params) AS ep WHERE ep.key = "consumption_environment") ambiente,
  count(DISTINCT CONCAT(user_pseudo_id, (SELECT ep.value.int_value FROM UNNEST(event_params) ep WHERE ep.key = "ga_session_id"))) AS sessions
  FROM ${ctx.ref(datasetGA4, "events_*")}
  WHERE _TABLE_SUFFIX = FORMAT_DATETIME('%Y%m%d', DATE(DATE_SUB(current_date('America/Sao_Paulo'), INTERVAL ${day_r} DAY))) 
  group by 1,2,3


)

select 
  date,
  dp.nome_schema,
  dp.numero_propriedade, 
  dp.nome_propriedade,
  ambiente,
  platform,
  video_playtimes,
  video_views,
  not_logged_users,
  logged_users,
  screen_views,
  page_views,
  sessions,
  current_datetime bigquery_ingestion
from total_hit
FULL OUTER JOIN page_view USING (date,platform,ambiente)
FULL OUTER JOIN screen_view USING (date,platform,ambiente)
FULL OUTER JOIN logged_user USING (date,platform,ambiente)
FULL OUTER JOIN not_logged_user USING (date,platform,ambiente)
FULL OUTER JOIN video_start USING (date,platform,ambiente)
FULL OUTER JOIN video_playtime USING (date,platform,ambiente)
FULL OUTER JOIN total_session USING (date,platform,ambiente)
LEFT JOIN gglobo-ga4-hdg-prd.common.de_para_propriedade_schema dp on "${datasetGA4}" = dp.nome_schema)`;

            return ga4_query;
        });

    const finalQuery = `
    ${tenantQueries.join("\nUNION ALL\n")}
  `;

    return finalQuery;
});
