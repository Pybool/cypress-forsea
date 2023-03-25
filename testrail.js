var btoa = require('btoa')
const axios = require('axios')
const fs=require('fs')
require('dotenv').config()
const envFIle=process.env
const options = {
  username: envFIle.TESTRAIL_USERNAME,
  password: envFIle.TESTRAIL_PASSWORD,
  url: envFIle.TESTRAIL_URL,
}
const projectId = envFIle.TESTRAIL_PROJECTID
const testrailPlan = envFIle.TESTRAIL_PLAN
const suiteId = envFIle.TESTRAIL_SUITEID
const auth = btoa(options.username + ':' + options.password)
const opt = { headers: { 'Authorization': `Basic ${auth}` } }


async function createTestRun() {

  const response = await axios.post(
    `${options.url}/index.php?/api/v2/add_plan_entry/${testrailPlan}`,
    {
      suite_id: suiteId,
      name: 'Testrails setup',
      include_all: true,
    },
    {
      auth: {
        username: options.username,
        password: options.password,
      },
    },
  )
  return response.data.runs[0].id

}
async function createCaseAndPublishResult(test,runId){
  var response = await axios.get(
    `${options.url}/index.php?/api/v2/get_cases/${projectId}&suite_id=${suiteId}&section_id=185`,opt,
  )
  const genratedCase=generateEachCase(test)
  var cases
  for(let i=0;i<genratedCase.length;i++){

    while(1){
      cases=response.data.cases.filter(function(v){
        return v.title===genratedCase[i][0].title
      })
      if(cases.length>0 || response.data._links.next==null){
        break

      }else{
        response = await axios.get(
          `${options.url}/index.php?${response.data._links.next}`,opt,
        )
      }
    }

    if(cases.length>0){
      await axios.post(`${options.url}/index.php?/api/v2/update_case/${cases[0].id}`, genratedCase[i][0], opt)
      await publishTestRun(cases[0].id,genratedCase[i][1],runId)

    }else{
      try{
        await axios.get(`${options.url}/index.php?/api/v2/get_sections/${projectId}&suite_id=${suiteId}`,opt)
        var resp=await axios.post(`${options.url}/index.php?/api/v2/add_case/185`,genratedCase[i][0],opt)
        await publishTestRun(resp.data.id,genratedCase[i][1],runId)
      }catch(e){
        // throw e
        console.log(e)
      }
    }
  }


}
function generateEachCase(test){
  const cases=[]
  var i=0
  test[0].elements.forEach(element=>{
    const steps=[]
    let status=true
    let duration  = 0
    element.steps.forEach(step=>{
      let additional_info=step.result.status
      duration+=step.result.duration
      if(step.result.status=='failed' || step.result.status =='pending'){
        status=false
        additional_info=additional_info + '=>'+step?.result?.error_message
      }
      if(step.name!=''){
        steps.push({
          'content':step.keyword+' '+step.name,
          'expected':additional_info,
          'additional_info':additional_info,
          'refs':'',
        })
      }
    })
    i++
    cases.push([{
      'title': element.name+i,
      'type_id': 1,
      'priority_id': 3,
      //"estimate": parseInt(duration/60000000).toString()+"m",
      'refs': '',
      'template_id': 2,
      'custom_steps_separated': steps,
    },status])
  })
  return cases
}
async function publishTestRun(caseIds,statusId,runId) {
  var statId
  if(statusId){
    statId=1
  }else{
    statId=5
  }
  try{
    await axios.post(
      `${options.url}/index.php?/api/v2/add_results_for_cases/${runId}`,
      {
        'results': [
          {
            'case_id': caseIds,
            'status_id': statId,
            'comment': '',
            'defects': '',

          },
        ],
      },opt,
    )
  }catch(e){
    throw new Error('Unable to add run cast to testrail'+runId)
  }


}
exports.cleanDirectory=()=>{
  const resultDir='cypress/cucumber-json/'
  fs.readdirSync(resultDir).forEach(v=>fs.rmSync(resultDir+v))
}
const exportTest=   async ()=>{
  const resultDir='cypress/cucumber-json/'
  let allFiles=[]
  if(fs.existsSync(resultDir)){
    allFiles=fs.readdirSync(resultDir)
    const runId=await createTestRun()
    for(const file of allFiles){
      try{
        const file_location=JSON.parse(fs.readFileSync(resultDir+file))
        await createCaseAndPublishResult(file_location,runId)
      }catch(e){

        console.log(e)      }

    }



    //fs.readdirSync(resultDir).forEach(v=>fs.rmSync(resultDir+v))
  }else{
    throw new Error('No File to export')
  }


}
exportTest()