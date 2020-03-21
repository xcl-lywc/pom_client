import Vue from 'vue'
import Router from 'vue-router'
// 登录
const Login = () => import('./views/Login.vue')

// 欢迎光临
const Welcome = () => import('./views/Welcome.vue')

// 公用Index
const Index =() => import('./views/Index.vue')

// ********************* 外部链接 start ***********************/
const LinksIndex =() => import('./views/mainFunction/Index.vue')
const LinksHome = () => import('./views/mainFunction/Home.vue')
const LinksSuperiorReminderDetailPage = () => import('./views/mainFunction/taskManagementComponents/SuperiorReminderDetailPage.vue')
const LinksToDoListCompletePage = () => import('./views/mainFunction/taskManagementComponents/ToDoListCompletePage.vue')
const LinksUpTaskDetailPage = () => import('./views/mainFunction/taskManagementComponents/UpTaskDetailPage.vue')
// ********************* 外部链接 end ***********************/


// ********************* 党员页面 start ***********************/
const PartyMemberIndex =() => import('./views/partyMember/Index.vue')
const PartyMemberHome = () => import('./views/partyMember/Home.vue') 

//收藏
const PMCollectionArticleInformation = () => import('./views/partyMember/myCollection/ArticleInformation.vue') 
const PMCollectionArticleDetail = () => import('./views/partyMember/myCollection/ArticleDetail.vue')  
const PMNAArticleList = () => import('./views/partyMember/noticeAnnouncement/ArticleList.vue')
const PMNAArticleDetail = () => import('./views/partyMember/noticeAnnouncement/ArticleDetail.vue') 
const PMOrganizationalStructure = () => import('./views/partyMember/OrganizationalStructure.vue') 
const PMSecretaryMailbox = () => import('./views/partyMember/mailbox/SecretaryMailbox.vue')
const PMSecretaryMailboxDetail = () => import('./views/partyMember/mailbox/Detail.vue')
const PMCreateMailbox = () => import('./views/partyMember/mailbox/CreateMailbox.vue')
const OnlinePartyLecturesTemp = () => import('./views/mainFunction/components/Temp.vue')
const PMExercisesExaminationPaperTemp = () => import('./views/mainFunction/components/Temp.vue')
//个人信息
const PMMessage = () => import('./views/partyMember/myMessage/Message.vue') 
const PMBasicsMessage = () => import('./views/partyMember/myMessage/BasicsMessage.vue') 
const PMSocialRelations = () => import('./views/partyMember/myMessage/SocialRelations.vue')
const PMExperienceRecord = () => import('./views/partyMember/myMessage/ExperienceRecord.vue') 
const PMGetRecords = () => import('./views/partyMember/myMessage/GetRecords.vue') 
// 任务管理
const PartyMemberPresetTask = () => import('./views/partyMember/taskManagement/PresetTask.vue')
const PartyMemberUpTask = () => import('./views/partyMember/taskManagement/UpTask.vue')
const PartyMemberDownTask = () => import('./views/partyMember/taskManagement/DownTask.vue')
const PartyMemberDownTaskDetail = () => import('./views/partyMember/taskManagement/DownTaskDetail.vue')
const PartyMemberToDoList = () => import('./views/partyMember/taskManagement/ToDoList.vue')
const PartyMemberSuperiorReminder = () => import('./views/partyMember/taskManagement/SuperiorReminder.vue')
const PartyMemberOrgNotice = () => import('./views/partyMember/taskManagement/OrgNotice.vue')
const PMMeetingTemp = () => import('./views/mainFunction/components/Temp.vue')
const PMTopicTemp = () => import('./views/mainFunction/components/Temp.vue')
const PMHeartTalkTemp = () => import('./views/mainFunction/components/Temp.vue')
//学习考核
const PMIntegral = () => import('./views/partyMember/learningAssessment/Integral.vue')
const PMTypeArticleList = () => import('./views/partyMember/learningAssessment/TypeArticleList.vue')
const PMArticleList = () => import('./views/partyMember/learningAssessment/ArticleList.vue')
const PMArticleDetail = () => import('./views/partyMember/learningAssessment/ArticleDetail.vue')
const PMCalender = () => import('./views/partyMember/learningAssessment/Calender.vue') 
const PMOnlinePartySchoolTemp = () => import('./views/mainFunction/components/Temp.vue')
const PMOnlineExaminationTemp = () => import('./views/mainFunction/components/Temp.vue')
// 党员服务
const PMPayFees = () => import('./views/partyMember/partyService/PayFees.vue')
const PMJoinParty = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMFormalParty = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMPrepareParty = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMTransferOrganizationTemp = () => import('./views/mainFunction/components/Temp.vue')
// 党员义务
const PMOIdeologicalReport = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMOWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMOWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMOLearningExperience = () => import('./components/activiti/ActivitiFormPage.vue') 
// 投票调研
const ExercisesVotingTemp01 = () => import('./views/mainFunction/components/Temp.vue')
const OnlineResearchTemp01 = () => import('./views/mainFunction/components/Temp.vue')
const CollectionSuggestionsTemp01 = () => import('./views/mainFunction/components/Temp.vue')
// 流程自定义表单的创建
const PMActivitiFormCreate = () => import('./components/activiti/form/ActivitiFormCreate.vue') 


// ********************* 党员页面 end ***********************/


// ********************* 组织页面 start ***********************/
// 党委,党支部，党小组的页面都统一用这些
// 根据类型不同做一些权限管理即可
const MainFunctionIndex =() => import('./views/mainFunction/Index.vue')
const mainFunctionHome = () => import('./views/mainFunction/Home.vue')
const CreateArticle = () => import('./views/mainFunction/systemSetup/CreateArticle.vue')
const mainFunctionInfo = () => import('./views/mainFunction/organizationalStructure/Info.vue')
const mainFunctionTeamManagement = () => import('./views/mainFunction/organizationalStructure/TeamManagement.vue')
const FunctionalDepartments = () => import('./views/mainFunction/organizationalStructure/FunctionalDepartments.vue')
const SubordinateBranch = () => import('./views/mainFunction/organizationalStructure/SubordinateBranch.vue')
const SubordinateGroup = () => import('./views/mainFunction/organizationalStructure/SubordinateGroup.vue')
const SubordinatePartyCommittee = () => import('./views/mainFunction/organizationalStructure/SubordinatePartyCommittee.vue')
const PartyRoster = () => import('./views/mainFunction/organizationalStructure/PartyRoster.vue')
const EntryApplication = () => import('./views/mainFunction/organizationalStructure/EntryApplication.vue')
const SecretaryMailbox = () => import('./views/mainFunction/organizationalStructure/mailbox/SecretaryMailbox.vue')
const SecretaryMailboxDetail = () => import('./views/mainFunction/organizationalStructure/mailbox/Detail.vue')

//组织地图
const OrgMap = () => import('./views/mainFunction/OrgMap.vue') 
// 系统设置
// 文章列表
const AnnounceArticle = () => import('./views/mainFunction/systemSetup/AnnounceArticle.vue')
const PoliciesArticle = () => import('./views/mainFunction/systemSetup/PoliciesArticle.vue')
const LeaderArticle = () => import('./views/mainFunction/systemSetup/LeaderArticle.vue')
const CentreArticle = () => import('./views/mainFunction/systemSetup/CentreArticle.vue')
const CorruptionArticle = () => import('./views/mainFunction/systemSetup/CorruptionArticle.vue')
const CLearnArticle = () => import('./views/mainFunction/systemSetup/CLearnArticle.vue')
const RoadArticle = () => import('./views/mainFunction/systemSetup/RoadArticle.vue')
const StoneArticle = () => import('./views/mainFunction/systemSetup/StoneArticle.vue')
const InstitutionArticle = () => import('./views/mainFunction/systemSetup/InstitutionArticle.vue')
const PMLearnArticle = () => import('./views/mainFunction/systemSetup/PMLearnArticle.vue')
const SuperiorArticle = () => import('./views/mainFunction/systemSetup/SuperiorArticle.vue')
//文章详情
const AnnounceArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/AnnounceArticleDetail.vue')
const PoliciesArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/PoliciesArticleDetail.vue')
const LeaderArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/LeaderArticleDetail.vue')
const CentreArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/CentreArticleDetail.vue')
const CorruptionArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/CorruptionArticleDetail.vue')
const CLearnArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/CLearnArticleDetail.vue')
const RoadArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/RoadArticleDetail.vue')
const StoneArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/StoneArticleDetail.vue')
const InstitutionArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/InstitutionArticleDetail.vue')
const PMLearnArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/PMLearnArticleDetail.vue')
const SuperiorArticleDetail = () => import('./views/mainFunction/systemSetup/articleDetail/SuperiorArticleDetail.vue')
// 党费管理
const PFMTurnRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PFMCollectionReport = () => import('./views/mainFunction/partyFeesManagement/CollectionReport.vue')
const PFMUseRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PFMUseApproval = () => import('./components/activiti/ActivitiFormPage.vue')
const PFMReportRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PFMFeesVerification = () => import('./views/mainFunction/partyFeesManagement/FeesVerification.vue')
const PFMPayDetail = () => import('./views/mainFunction/partyFeesManagement/PayDetail.vue')
const PFMPayTotal = () => import('./views/mainFunction/partyFeesManagement/PayTotal.vue')
// 任务管理
const PartyCommitteePresetTask = () => import('./views/mainFunction/taskManagement/PresetTask.vue')
const PartyCommitteeUpTask = () => import('./views/mainFunction/taskManagement/UpTask.vue')
const PartyCommitteeDownTask = () => import('./views/mainFunction/taskManagement/DownTask.vue')
const PartyCommitteeDownTaskDetail = () => import('./views/mainFunction/taskManagement/DownTaskDetail.vue')
const PartyCommitteeToDoList = () => import('./views/mainFunction/taskManagement/ToDoList.vue')
const PartyCommitteeSuperiorReminder = () => import('./views/mainFunction/taskManagement/SuperiorReminder.vue')
const PartyCommitteeOrgNotice = () => import('./views/mainFunction/taskManagement/OrgNotice.vue')
const PartyCommitteeMeetingTemp = () => import('./views/mainFunction/components/Temp.vue')
const PartyCommitteeTopicTemp = () => import('./views/mainFunction/components/Temp.vue')
// 综合事务
const CAWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const CAWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const CAActivityRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CAOfficeRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CASpecialRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CAMeetingRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CAOpenRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CAChronicleEvent = () => import('./components/activiti/ActivitiFormPage.vue')
// 组织管理
const OMOrgSetRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OMOrgChangeRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OMOrgCancelRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OMCommitteeChangeRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OMCommitteeMembers = () => import('./views/mainFunction/orgManagement/CommitteeMembers.vue')
// 干部管理
const CMMiddleRoster = () => import('./views/mainFunction/cadreManagement/MiddleRoster.vue')
const CMMiddleReserveRoster = () => import('./views/mainFunction/cadreManagement/MiddleReserveRoster.vue')
const CMGoodWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const CMGoodWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const CMInspectionRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CMPerformanceInspectionRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CMAppointmentRemovalRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CMRewardPunishmentRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 学习教育
const LEEducationPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const LEEducationRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const LEEducationSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const LEResearchArticle = () => import('./components/activiti/ActivitiFormPage.vue')
const LEReportRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 创先争优
const SEWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const SEWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
// 宣传文化
const PCWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const PCWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const PCActivityRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PCInterviewRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PCPublicSentimentRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PCPoliticalResearch = () => import('./components/activiti/ActivitiFormPage.vue')
const PCThoughtReport = () => import('./components/activiti/ActivitiFormPage.vue')
const PCForeignNewsReport = () => import('./views/mainFunction/propagandaCulture/ForeignNewsReport.vue')
// 组织生活
const OLPCLifeAssociationRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OLPMConferenceRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OLPBCommitteeMeetingRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OLPBLifeAssociationRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OLPGMeetingRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const OLPartyLectureRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 党员管理
const PMMStaffRoster = () => import('./views/mainFunction/partyMemberManagement/StaffRoster.vue')
const PMMPartyMembersRoster = () => import('./views/mainFunction/partyMemberManagement/PartyMembersRoster.vue')
const PMMThreeRegisterRecord = () => import('./views/mainFunction/partyMemberManagement/ThreeRegisterRecord.vue')
const PMMSubmitApplication = () => import('./views/mainFunction/partyMemberManagement/SubmitApplication.vue')
const PMMPartyMembersWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const PMMPartyMembersWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const PMMPartyMembersPersonalThought = () => import('./components/activiti/ActivitiFormPage.vue')
const PMMPartyMembersAnalysisReport = () => import('./components/activiti/ActivitiFormPage.vue')
const PMMPartyMembersAwardsRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const PMMPartyMembersViolationRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 党员管理 - 党员义务
const PMMOIdeologicalReport = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMMOWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMMOWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue') 
const PMMOLearningExperience = () => import('./components/activiti/ActivitiFormPage.vue') 
// 党风廉政
const CHGWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGDutyPCReportRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGDutySignRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGDutyCheckRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGDutyReportRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGEducationRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGPromiseRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGDebriefingRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGOpinionRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const CHGGiftRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 群团工作
const MWWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue')
const MWWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue')
const MWActivityRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 谈心谈话
const HTActiveTalkRecord = () => import('./components/activiti/ActivitiFormPage.vue')
const HTHonestTalkRecord = () => import('./components/activiti/ActivitiFormPage.vue')
// 党费收缴
const PFCFeesVerification = () => import('./views/mainFunction/partyFeesCollection/FeesVerification.vue')
const PFCFeesPay = () => import('./views/mainFunction/partyFeesCollection/FeesPay.vue')
const PFCFeesManagement = () => import('./views/mainFunction/partyFeesCollection/FeesManagement.vue')
// 网上党校
const PartyLectureMaterials = () => import('./views/mainFunction/onlinePartySchool/PartyLectureMaterials.vue')
const PartyLectureDetail = () => import('./views/mainFunction/onlinePartySchool/PartyLectureDetail.vue')
const OnlineLearningTemp = () => import('./views/mainFunction/components/Temp.vue')
const PartyLectureDataTemp = () => import('./views/mainFunction/components/Temp.vue')
// 投票调研
const ExercisesVotingTemp = () => import('./views/mainFunction/components/Temp.vue')
const OnlineResearchTemp = () => import('./views/mainFunction/components/Temp.vue')
const CollectionSuggestionsTemp = () => import('./views/mainFunction/components/Temp.vue')
// 在线考试
const ExercisesExaminationPaperTemp = () => import('./views/mainFunction/components/Temp.vue')
const OnlineExaminationTemp = () => import('./views/mainFunction/components/Temp.vue')
const ExaminationDataTemp = () => import('./views/mainFunction/components/Temp.vue')
// 发展党员
const DevelopingPartyMembers = () => import('./views/mainFunction/components/Temp.vue')
// 流程自定义表单的创建
const MFActivitiFormCreate = () => import('./components/activiti/form/ActivitiFormCreate.vue')
// ********************* 组织页面 end ***********************/


// ********************* 职工页面 start ***********************/
const StaffAndWorkersIndex =() => import('./views/staffAndWorkers/Index.vue')
const StaffAndWorkersHome = () => import('./views/staffAndWorkers/Home.vue')
// 任务管理
const StaffAndWorkersPresetTask = () => import('./views/staffAndWorkers/taskManagement/PresetTask.vue')
const StaffAndWorkersUpTask = () => import('./views/staffAndWorkers/taskManagement/UpTask.vue')
const StaffAndWorkersDownTask = () => import('./views/staffAndWorkers/taskManagement/DownTask.vue')
const StaffAndWorkersDownTaskDetail = () => import('./views/staffAndWorkers/taskManagement/DownTaskDetail.vue')
const StaffAndWorkersToDoList = () => import('./views/staffAndWorkers/taskManagement/ToDoList.vue')
const StaffAndWorkersSuperiorReminder = () => import('./views/staffAndWorkers/taskManagement/SuperiorReminder.vue')
const StaffAndWorkersOrgNotice = () => import('./views/staffAndWorkers/taskManagement/OrgNotice.vue')
const SWMeetingTemp = () => import('./views/mainFunction/components/Temp.vue')
const SWTopicTemp = () => import('./views/mainFunction/components/Temp.vue')
const SWHeartTalkTemp = () => import('./views/mainFunction/components/Temp.vue')
//个人信息
const SAWMessage = () => import('./views/staffAndWorkers/myMessage/Message.vue') 
const SAWBasicsMessage = () => import('./views/staffAndWorkers/myMessage/BasicsMessage.vue') 
const SAWSocialRelations = () => import('./views/staffAndWorkers/myMessage/SocialRelations.vue')
const SAWExperienceRecord = () => import('./views/staffAndWorkers/myMessage/ExperienceRecord.vue') 
const SAWGetRecords = () => import('./views/staffAndWorkers/myMessage/GetRecords.vue') 
//我的收藏
const SAWCollectionArticleInformation = () => import('./views/staffAndWorkers/myCollection/ArticleInformation.vue') 
const SAWCollectionArticleDetail = () => import('./views/staffAndWorkers/myCollection/ArticleDetail.vue')  
const SWOnlinePartyLecturesTemp = () => import('./views/mainFunction/components/Temp.vue')
const SWExercisesExaminationPaperTemp = () => import('./views/mainFunction/components/Temp.vue')
//学习考核
const SAWIntegral = () => import('./views/staffAndWorkers/learningAssessment/Integral.vue')
const SAWTypeArticleList = () => import('./views/staffAndWorkers/learningAssessment/TypeArticleList.vue')
const SAWArticleList = () => import('./views/staffAndWorkers/learningAssessment/ArticleList.vue')
const SAWArticleDetail = () => import('./views/staffAndWorkers/learningAssessment/ArticleDetail.vue')
const SAWCalender = () => import('./views/staffAndWorkers/learningAssessment/Calender.vue') 
const SWOnlinePartySchoolTemp = () => import('./views/mainFunction/components/Temp.vue')
const SWOnlineExaminationTemp = () => import('./views/mainFunction/components/Temp.vue')
// 党员义务
const SAWOIdeologicalReport = () => import('./components/activiti/ActivitiFormPage.vue') 
const SAWOWorkPlan = () => import('./components/activiti/ActivitiFormPage.vue') 
const SAWOWorkSummary = () => import('./components/activiti/ActivitiFormPage.vue') 
const SAWOLearningExperience = () => import('./components/activiti/ActivitiFormPage.vue')
// 党员服务
const SAWSJoinParty = () => import('./components/activiti/ActivitiFormPage.vue') 

// 流程自定义表单的创建
const SAWActivitiFormCreate = () => import('./components/activiti/form/ActivitiFormCreate.vue')
// ********************* 职工页面 end ***********************/
//********************** 工作记录统计数据 ********************/
const ResultIndex = () => import('./views/mainFunction/orgWorkResult/index.vue')
const ResultGeneralAffairs = () => import('./views/mainFunction/orgWorkResult/generalAffairsResult.vue')
const moreResultIndex = () => import('./views/mainFunction/orgWorkResult/moreIndex.vue')
//********************** 工作记录统计数据  end ********************/


Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/web/",
  routes: [ 
    { path: "/", redirect: "/partymember" },  
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        showNav: false,
        type: 'blank-layout'
      }
    },
    {
      path: '/welcome', 
      name: 'Welcome',
      component: Welcome,
      meta: {
        showNav: true,
        type: 'nav-layout'
      },
    },
    //***************** 外部链接页面 ****************
    {
    	path: '/links', 
      // name: 'LinksIndex',
      component: LinksIndex,
      meta: {
        showNav: true,
        type: 'nav-layout'
      },
    	children:[
    		{path: "", name: "LinksHome", navName: '首页', component: LinksHome, meta: {type: 'nav-layout', showNav: true }},   
    		{path: "uptask_detail", name: "LinksUpTaskDetailPage", navName: '上级任务-查看与完成页面', component: LinksUpTaskDetailPage, meta: {type: 'nav-layout', showNav: true }},
    		{path: "todolist_complete", name: "LinksToDoListCompletePage", navName: '待处理任务-完成页面', component: LinksToDoListCompletePage, meta: {type: 'nav-layout', showNav: true }},
    		{path: "superiorreminder_detail", name: "LinksSuperiorReminderDetailPage", navName: '上级通知-详情', component: LinksSuperiorReminderDetailPage, meta: {type: 'nav-layout', showNav: true }},
    	]
    },
    //***************** 党员页面 ****************
    {
      path: '/partymember', 
      // name: 'PartyMemberIndex',
      component: PartyMemberIndex,
      meta: {
        showNav: true,
        type: 'nav-layout'
      },
      children: [
        {path: "", name: "PartyMemberHome", navName: '党员首页', component: PartyMemberHome, meta: {type: 'nav-layout', showNav: true }},   
        {path: "naarticlelist", name: "PMNAArticleList", navName: '通知公告列表', component: PMNAArticleList, meta: {type: 'nav-layout', showNav: true }},
        {path: "naarticledetail/:type_id/:article_id", name: "PMNAArticleDetail", navName: '通知公告详情', component: PMNAArticleDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "typearticlelist/:key_type", name: "PMTypeArticleList", navName: '文章分类列表', component: PMTypeArticleList, meta: {type: 'nav-layout', showNav: true }},
        {path: "articlelist/:type_id", name: "PMArticleList", navName: '文章列表', component: PMArticleList, meta: {type: 'nav-layout', showNav: true }},
        {path: "articledetail/:type_id/:article_id", name: "PMArticleDetail", navName: '政策法规详情', component: PMArticleDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "articleinformation", name: "PMCollectionArticleInformation", navName: '文章资讯', component: PMCollectionArticleInformation, meta: {type: 'nav-layout', showNav: true }},
        {path: "collectionarticledetail/:article_id", name: "PMCollectionArticleDetail", navName: '文章详情', component: PMCollectionArticleDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "message", name: "PMMessage", navName: '党员信息', component: PMMessage, meta: {type: 'nav-layout', showNav: true }},
        {path: "basicsmessage", name: "PMBasicsMessage", navName: '基础信息', component: PMBasicsMessage, meta: {type: 'nav-layout', showNav: true }},
        {path: "socialrelations", name: "PMSocialRelations", navName: '社会关系', component: PMSocialRelations, meta: {type: 'nav-layout', showNav: true }},
        {path: "experiencerecord", name: "PMExperienceRecord", navName: '经历记录', component: PMExperienceRecord, meta: {type: 'nav-layout', showNav: true }},
        {path: "getrecords", name: "PMGetRecords", navName: '成果记录', component: PMGetRecords, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlinepartylectures", name: "OnlinePartyLecturesTemp", navName: '网上党课', component: OnlinePartyLecturesTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "pmexercisesexaminationpaper", name: "PMExercisesExaminationPaperTemp", navName: '习题试卷', component: PMExercisesExaminationPaperTemp, meta: {type: 'nav-layout', showNav: true }},

        {path: "presettask", name: "PartyMemberPresetTask", navName: '预设动作', component: PartyMemberPresetTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "uptask", name: "PartyMemberUpTask", navName: '上级任务', component: PartyMemberUpTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtask", name: "PartyMemberDownTask", navName: '下级任务', component: PartyMemberDownTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtaskdetail/:id", name: "PartyMemberDownTaskDetail", navName: '下级任务-详情', component: PartyMemberDownTaskDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "todolist", name: "PartyMemberToDoList", navName: '待处理任务', component: PartyMemberToDoList, meta: {type: 'nav-layout', showNav: true }},
        {path: "superiorreminder", name: "PartyMemberSuperiorReminder", navName: '上级通知', component: PartyMemberSuperiorReminder, meta: {type: 'nav-layout', showNav: true }},
        {path: "orgnotice", name: "PartyMemberOrgNotice", navName: '下级通知', component: PartyMemberOrgNotice, meta: {type: 'nav-layout', showNav: true }},
        {path: "meeting", name: "PMMeetingTemp", navName: '会议', component: PMMeetingTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "topic", name: "PMTopicTemp", navName: '主题活动', component: PMTopicTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "hearttalk", name: "PMHeartTalkTemp", navName: '谈心谈话', component: PMHeartTalkTemp, meta: {type: 'nav-layout', showNav: true }},

        {path: "exercisesvoting", name: "ExercisesVotingTemp01", navName: '在线投票', component: ExercisesVotingTemp01, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlineresearch", name: "OnlineResearchTemp01", navName: '在线调研', component: OnlineResearchTemp01, meta: {type: 'nav-layout', showNav: true }},
        {path: "collectionsuggestions", name: "CollectionSuggestionsTemp01", navName: '意见建议', component: CollectionSuggestionsTemp01, meta: {type: 'nav-layout', showNav: true }},

        {path: "organizationalstructure", name: "PMOrganizationalStructure", navName: '组织架构', component: PMOrganizationalStructure, meta: {type: 'nav-layout', showNav: true }},
        {path: "secretarymailbox", name: "PMSecretaryMailbox", navName: '书记信箱', component: PMSecretaryMailbox, meta: {type: 'nav-layout', showNav: true }},
        {path: "secretarymailboxdetail/:mailbox_id/:operation_type", name: "PMSecretaryMailboxDetail", navName: '书记信箱详情', component: PMSecretaryMailboxDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "createmailbox/:org_id/:org_name", name: "PMCreateMailbox", navName: '发送邮件', component: PMCreateMailbox, meta: {type: 'nav-layout', showNav: true }},

        {path: "transferorganization", name: "PMTransferOrganizationTemp", navName: '转组织关系', component: PMTransferOrganizationTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "payfees", name: "PMPayFees", navName: '缴纳党费', component: PMPayFees, meta: {type: 'nav-layout', showNav: true }},
        {path: "integral", name: "PMIntegral", navName: '我的积分', component: PMIntegral, meta: {type: 'nav-layout', showNav: true }},
        {path: "calender", name: "PMCalender", navName: '签到日历', component: PMCalender, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlinepartyschool", name: "PMOnlinePartySchoolTemp", navName: '网上党校', component: PMOnlinePartySchoolTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlineexamination", name: "PMOnlineExaminationTemp", navName: '在线考试', component: PMOnlineExaminationTemp, meta: {type: 'nav-layout', showNav: true }},
        
        {path: "pm_activitiformcreate/:type/:key", name: "PMActivitiFormCreate", navName: '流程自定义表单的创建页面', component: PMActivitiFormCreate, meta: {type: 'nav-layout', showNav: true }},
        // ==== 流程自定义表单相关页面 ==== 
        // this.$route.meta  元数据
        // meta.type  1-工作台的工作记录查询与创建 ；2-党员或职工的工作记录查询与创建 ；3-申请入党或申请转正、转预备的工作记录查询与申请录入 ；4-工作台党员义务的工作记录查询
        // 通过元数据，自定义配置流程表单所需的相关数据
        {path: "pmo_ideologicalreport", name: "PMOIdeologicalReport", navName: '思想汇报', component: PMOIdeologicalReport, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '思想汇报', type:2,
          	activitiKeyList: [{name:'月度',key:'monthIdeologicalReport'},{name:'季度',key:'quarterlyThoughtReport'},{name:'年度',key:'yearThoughtReport'},{name:'其他',key:'otherThoughtReport'}],
      	  }
        },
        {path: "pmo_workplan", name: "PMOWorkPlan", navName: '工作规划', component: PMOWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '工作规划', type:2,
          	activitiKeyList: [{name:'月度',key:'monthWorkPlan'},{name:'季度',key:'quarterlyWorkPlan'},{name:'年度',key:'yearWorkPlan'},{name:'其他',key:'otherWorkPlan'}],
      	  }
        },
        {path: "pmo_worksummary", name: "PMOWorkSummary", navName: '工作总结', component: PMOWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '工作总结', type:2,
          	activitiKeyList: [{name:'月度',key:'monthWorkSummary'},{name:'季度',key:'quarterlyWorkSummary'},{name:'年度',key:'yearWorkSummary'},{name:'其他',key:'otherWorkSummary'}],
      	  }
        },
        {path: "pmo_learningexperience", name: "PMOLearningExperience", navName: '学习心得', component: PMOLearningExperience, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '学习心得', type:2,
          	activitiKeyList: [{name:'月度',key:'monthLearnExperience'},{name:'季度',key:'quarterlyLearnExperience'},{name:'年度',key:'yearLearnExperience'},{name:'其他',key:'otherLearnExperience'}],
      	  }
        },

        {path: "pm_joinparty", name: "PMJoinParty", navName: '入党申请', component: PMJoinParty, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员服务',navName: '入党申请', type:3, activitiKey: 'partyApplication',}
        },
        {path: "pm_formalparty", name: "PMFormalParty", navName: '转正申请', component: PMFormalParty, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员服务',navName: '转正申请', type:3, activitiKey: 'applicationForCorrection',}
        },
        {path: "pm_prepareparty", name: "PMPrepareParty", navName: '转预备申请', component: PMPrepareParty, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员服务',navName: '转预备申请', type:3, activitiKey: 'transferToPreparatoryApplication',}
        },
      ]
    },
    //***************** 党委，党支部，党小组页面 ****************
    {
      path: '/mainfunction', 
      // name: 'mainFunctionIndex',
      component: MainFunctionIndex,
      meta: {
        showNav: true,
        type: 'nav-layout'
      },
      children: [
        {path: "", name: "mainFunctionHome", navName: '党委首页', component: mainFunctionHome, meta: {type: 'nav-layout', showNav: true }},
        {path: "createarticle/:article_id/:article_type", name: "CreateArticle", navName: '上传文件', component: CreateArticle, meta: {type: 'nav-layout', showNav: true }},
        {path: "info", name: "mainFunctionInfo", navName: '党委信息', component: mainFunctionInfo, meta: {type: 'nav-layout', showNav: true }},
        {path: "teammanagement/:org_id/:party_nature", name: "mainFunctionTeamManagement", navName: '班子管理', component: mainFunctionTeamManagement, meta: {type: 'nav-layout', showNav: true }},
        {path: "functionaldepartments", name: "FunctionalDepartments", navName: '职能部门', component: FunctionalDepartments, meta: {type: 'nav-layout', showNav: true }},
        {path: "subordinatebranch", name: "SubordinateBranch", navName: '下级支部', component: SubordinateBranch, meta: {type: 'nav-layout', showNav: true }},
        {path: "subordinategroup", name: "SubordinateGroup", navName: '党小组', component: SubordinateGroup, meta: {type: 'nav-layout', showNav: true }},
        {path: "subordinatepartycommittee", name: "SubordinatePartyCommittee", navName: '下级党委', component: SubordinatePartyCommittee, meta: {type: 'nav-layout', showNav: true }},
        {path: "partyroster", name: "PartyRoster", navName: '党员花名册', component: PartyRoster, meta: {type: 'nav-layout', showNav: true }},
        {path: "entryapplication", name: "EntryApplication", navName: '录入申请', component: EntryApplication, meta: {type: 'nav-layout', showNav: true }},
        {path: "secretarymailbox", name: "SecretaryMailbox", navName: '书记信箱', component: SecretaryMailbox, meta: {type: 'nav-layout', showNav: true }},
        {path: "secretarymailboxdetail/:mailbox_id/:operation_type", name: "SecretaryMailboxDetail", navName: '书记信箱详情', component: SecretaryMailboxDetail, meta: {type: 'nav-layout', showNav: true }},

        {path: "announcearticle", name: "AnnounceArticle", component: AnnounceArticle, meta: {navName: '通知公告',type: 'nav-layout', showNav: true }},
        {path: "policiesarticle", name: "PoliciesArticle", component: PoliciesArticle, meta: {navName: '政策法规',type: 'nav-layout', showNav: true }},
        {path: "centrearticle", name: "CentreArticle", component: CentreArticle, meta: {navName: '中央精神', type: 'nav-layout', showNav: true }},
        {path: "leaderarticle", name: "LeaderArticle", component: LeaderArticle, meta: {navName: '领导讲话', type: 'nav-layout', showNav: true }},
        {path: "superiorarticle", name: "SuperiorArticle", component: SuperiorArticle, meta: {navName: '上级文件', type: 'nav-layout', showNav: true }},
        {path: "institutionarticle", name: "InstitutionArticle", component: InstitutionArticle, meta: {navName: '党建制度', type: 'nav-layout', showNav: true }},
        {path: "roadarticle", name: "RoadArticle", component: RoadArticle, meta: {navName: '学习路上', type: 'nav-layout', showNav: true }},
        {path: "corruptionarticle", name: "CorruptionArticle", component: CorruptionArticle, meta: {navName: '反腐倡廉', type: 'nav-layout', showNav: true }},
        {path: "stonearticle", name: "StoneArticle", component: StoneArticle, meta: {navName: '他山之石', type: 'nav-layout', showNav: true }},
        {path: "pmlearnarticle", name: "PMLearnArticle", component: PMLearnArticle, meta: {navName: '党员学习', type: 'nav-layout', showNav: true }},
        {path: "cLearnarticle", name: "CLearnArticle", component: CLearnArticle, meta: {navName: '干部学习', type: 'nav-layout', showNav: true }},
        {path: "announcearticledetail/:article_id", name: "AnnounceArticleDetail", component: AnnounceArticleDetail, meta: {navName: '通知公告',type: 'nav-layout', showNav: true }},
        {path: "policiesarticledetail/:article_id", name: "PoliciesArticleDetail", component: PoliciesArticleDetail, meta: {navName: '政策法规',type: 'nav-layout', showNav: true }},
        {path: "centrearticledetail/:article_id", name: "CentreArticleDetail", component: CentreArticleDetail, meta: {navName: '中央精神', type: 'nav-layout', showNav: true }},
        {path: "leaderarticledetail/:article_id", name: "LeaderArticleDetail", component: LeaderArticleDetail, meta: {navName: '领导讲话', type: 'nav-layout', showNav: true }},
        {path: "superiorarticledetail/:article_id", name: "SuperiorArticleDetail", component: SuperiorArticleDetail, meta: {navName: '上级文件', type: 'nav-layout', showNav: true }},
        {path: "institutionarticledetail/:article_id", name: "InstitutionArticleDetail", component: InstitutionArticleDetail, meta: {navName: '党建制度', type: 'nav-layout', showNav: true }},
        {path: "roadarticledetail/:article_id", name: "RoadArticleDetail", component: RoadArticleDetail, meta: {navName: '学习路上', type: 'nav-layout', showNav: true }},
        {path: "corruptionarticledetail/:article_id", name: "CorruptionArticleDetail", component: CorruptionArticleDetail, meta: {navName: '反腐倡廉', type: 'nav-layout', showNav: true }},
        {path: "stonearticledetail/:article_id", name: "StoneArticleDetail", component: StoneArticleDetail, meta: {navName: '他山之石', type: 'nav-layout', showNav: true }},
        {path: "pmlearnarticledetail/:article_id", name: "PMLearnArticleDetail", component: PMLearnArticleDetail, meta: {navName: '党员学习', type: 'nav-layout', showNav: true }},
        {path: "cLearnarticledetail/:article_id", name: "CLearnArticleDetail", component: CLearnArticleDetail, meta: {navName: '干部学习', type: 'nav-layout', showNav: true }},
             
        {path: "presettask", name: "PartyCommitteePresetTask", navName: '预设动作', component: PartyCommitteePresetTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "uptask", name: "PartyCommitteeUpTask", navName: '上级任务', component: PartyCommitteeUpTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtask", name: "PartyCommitteeDownTask", navName: '下级任务', component: PartyCommitteeDownTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtaskdetail/:id", name: "PartyCommitteeDownTaskDetail", navName: '下级任务-详情', component: PartyCommitteeDownTaskDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "todolist", name: "PartyCommitteeToDoList", navName: '待处理任务', component: PartyCommitteeToDoList, meta: {type: 'nav-layout', showNav: true }},
        {path: "superiorreminder", name: "PartyCommitteeSuperiorReminder", navName: '上级通知', component: PartyCommitteeSuperiorReminder, meta: {type: 'nav-layout', showNav: true }},
        {path: "orgnotice", name: "PartyCommitteeOrgNotice", navName: '下级通知', component: PartyCommitteeOrgNotice, meta: {type: 'nav-layout', showNav: true }},
        {path: "meeting", name: "PartyCommitteeMeetingTemp", navName: '会议', component: PartyCommitteeMeetingTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "topic", name: "PartyCommitteeTopicTemp", navName: '主题活动', component: PartyCommitteeTopicTemp, meta: {type: 'nav-layout', showNav: true }},

        {path: "pfc_feesverification", name: "PFCFeesVerification", navName: '党费核定', component: PFCFeesVerification, meta: {type: 'nav-layout', showNav: true }},
        {path: "pfm_feesverification", name: "PFMFeesVerification", navName: '党支部党员交纳党费核定', component: PFMFeesVerification, meta: {type: 'nav-layout', showNav: true }},
        {path: "feespay", name: "PFCFeesPay", navName: '党费缴纳情况', component: PFCFeesPay, meta: {type: 'nav-layout', showNav: true }},
        {path: "paydetail", name: "PFMPayDetail", navName: '党支部党费收缴情况', component: PFMPayDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "paytotal", name: "PFMPayTotal", navName: '党小组党员交纳党费名单', component: PFMPayTotal, meta: {type: 'nav-layout', showNav: true }},
        {path: "feesmanagement", name: "PFCFeesManagement", navName: '党费收缴使用管理情况', component: PFCFeesManagement, meta: {type: 'nav-layout', showNav: true }},
        {path: "partylecturematerials", name: "PartyLectureMaterials", navName: '党课资料', component: PartyLectureMaterials, meta: {type: 'nav-layout', showNav: true }},
        {path: "partylecturedetail/:lecture_id", name: "PartyLectureDetail", navName: '党课详情', component: PartyLectureDetail, meta: {type: 'nav-layout', showNav: true }},

        {path: "onlinelearning", name: "OnlineLearningTemp", navName: '在线学习', component: OnlineLearningTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "partylecturedata", name: "PartyLectureDataTemp", navName: '党课数据', component: PartyLectureDataTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "exercisesexaminationpaper", name: "ExercisesExaminationPaperTemp", navName: '习题试卷', component: ExercisesExaminationPaperTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlineexamination", name: "OnlineExaminationTemp", navName: '在线考试', component: OnlineExaminationTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "examinationdata", name: "ExaminationDataTemp", navName: '考核数据', component: ExaminationDataTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "exercisesvoting", name: "ExercisesVotingTemp", navName: '在线投票', component: ExercisesVotingTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlineresearch", name: "OnlineResearchTemp", navName: '在线调研', component: OnlineResearchTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "collectionsuggestions", name: "CollectionSuggestionsTemp", navName: '意见建议收集', component: CollectionSuggestionsTemp, meta: {type: 'nav-layout', showNav: true }},

        {path: "orgmap/:areaid", name: "OrgMap", navName: '党建地图', component: OrgMap, meta: {type: 'nav-layout', showNav: true }},

        {path: "developingpartymembers", name: "DevelopingPartyMembers", navName: '发展党员', component: DevelopingPartyMembers, meta: {type: 'nav-layout', showNav: true }},

        {path: "pfm_collectionreport", name: "PFMCollectionReport", navName: '党费收缴报告单', component: PFMCollectionReport, meta: {type: 'nav-layout',showNav: true ,superior:'党费管理',}},
        {path: "om_committeemembers", name: "OMCommitteeMembers", navName: '委员会委员名册', component: OMCommitteeMembers, meta: {type: 'nav-layout', showNav: true ,superior:'组织管理',}},
        {path: "cm_middleroster", name: "CMMiddleRoster", navName: '中层干部名册', component: CMMiddleRoster, meta: {type: 'nav-layout', showNav: true ,superior:'干部管理',}},
        {path: "cm_middlereserveroster", name: "CMMiddleReserveRoster", navName: '中层后备干部名册', component: CMMiddleReserveRoster, meta: {type: 'nav-layout', showNav: true ,superior:'干部管理',}},
        {path: "pmm_staffroster", name: "PMMStaffRoster", navName: '职工花名册', component: PMMStaffRoster, meta: {type: 'nav-layout', showNav: true ,superior:'党员管理',}},
        {path: "pmm_partymembersroster", name: "PMMPartyMembersRoster", navName: '党员花名册', component: PMMPartyMembersRoster, meta: {type: 'nav-layout', showNav: true ,superior:'党员管理',}},
        {path: "pmm_threeregisterrecord", name: "PMMThreeRegisterRecord", navName: '“三联”名册记录', component: PMMThreeRegisterRecord, meta: {type: 'nav-layout', showNav: true ,superior:'党员管理',}},
        {path: "pmm_submitapplication", name: "PMMSubmitApplication", navName: '党支部入党名册', component: PMMSubmitApplication, meta: {type: 'nav-layout', showNav: true ,superior:'党员管理',}},
        {path: "pc_foreignnewsreport", name: "PCForeignNewsReport", navName: '对外新闻宣传报道记录表', component: PCForeignNewsReport, meta: {type: 'nav-layout', showNav: true ,superior:'宣传文化',}},
        {path: "mf_activitiformcreate/:type/:key", name: "MFActivitiFormCreate", navName: '流程自定义表单的创建页面', component: MFActivitiFormCreate, meta: {type: 'nav-layout', showNav: true }},
        // ==== 流程自定义表单相关页面 ==== 
        // this.$route.meta  元数据
        // meta.type  1-工作台的工作记录查询与创建 ；2-党员或职工的工作记录查询与创建 ；3-申请入党或申请转正、转预备的工作记录查询与申请录入 ；4-工作台党员义务的工作记录查询
        // 通过元数据，自定义配置流程表单所需的相关数据
        {path: "pfm_turnrecord", name: "PFMTurnRecord", navName: '党费上缴记录', component: PFMTurnRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党费管理',navName: '党费上缴记录', type:1,activitiKey: 'PartyDuesTurnInRecord',}
        },
        {path: "pfm_userecord", name: "PFMUseRecord", navName: '党费使用记录', component: PFMUseRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党费管理',navName: '党费使用记录', type:1,activitiKey: 'partyExpenseUseRecord',}
        },
        {path: "pfm_useapproval", name: "PFMUseApproval", navName: '党费使用审批', component: PFMUseApproval, 
          meta: {type: 'nav-layout', showNav: true , superior:'党费管理',navName: '党费使用审批', type:1,activitiKey: 'PartyExpenseApprovalOfUse',}
        },
        {path: "pfm_reportrecord", name: "PFMReportRecord", navName: '党费收缴使用管理情况报告记录', component: PFMReportRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党费管理',navName: '党费收缴使用管理情况报告记录', type:1,activitiKey: 'PartyExpenseUseManagerRecord',}
        },

        {path: "ca_workplan", name: "CAWorkPlan", navName: '工作规划', component: CAWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '工作规划',  type:1,activitiKey: 'IntegratedServicesWorkPlanning',}
        },
        {path: "ca_worksummary", name: "CAWorkSummary", navName: '工作总结', component: CAWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '工作总结',  type:1,activitiKey: 'SummaryOfComprehensiveAffairs',}
        },
        {path: "ca_activityrecord", name: "CAActivityRecord", navName: '党建活动记录', component: CAActivityRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '党建活动记录',  type:1,activitiKey: 'PartyActivitiesRecord',}
        },
        {path: "ca_officerecord", name: "CAOfficeRecord", navName: '党委办公会议记录', component: CAOfficeRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '党委办公会议记录',  type:1,activitiKey: 'OfficeMinutes',}
        },
        {path: "ca_specialrecord", name: "CASpecialRecord", navName: '党委专题会议记录', component: CASpecialRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '党委专题会议记录',  type:1,activitiKey: 'SpecialMeetingMinutes',}
        },
        {path: "ca_meetingrecord", name: "CAMeetingRecord", navName: '党委会会议记录', component: CAMeetingRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '党委会会议记录',  type:1,activitiKey: 'PartyCommitteeMeetingRecord',}
        },
        {path: "ca_openrecord", name: "CAOpenRecord", navName: '党委公开工作记录', component: CAOpenRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '党委公开工作记录',  type:1,activitiKey: 'partyAffairsPublicityWorkRecord',}
        },
        {path: "ca_chronicleevent", name: "CAChronicleEvent", navName: '大事记', component: CAChronicleEvent, 
          meta: {type: 'nav-layout', showNav: true , superior:'综合事务',navName: '大事记', type:1, activitiKey: 'GreatChronicle',}
        },

        {path: "om_orgsetrecord", name: "OMOrgSetRecord", navName: '党组织设置工作记录', component: OMOrgSetRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织管理',navName: '党组织设置工作记录', type:1, activitiKey: 'partyOrgSetUpRecord',}
        },
        {path: "om_orgchangerecord", name: "OMOrgChangeRecord", navName: '党组织换届工作记录', component: OMOrgChangeRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织管理',navName: '党组织换届工作记录', type:1,activitiKey: 'partyOrgChangeRecord',}
        },
        {path: "om_orgcancelrecord", name: "OMOrgCancelRecord", navName: '党组织撤销工作记录', component: OMOrgCancelRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织管理',navName: '党组织撤销工作记录', type:1, activitiKey: 'partyOrgRevokeRecord',}
        },
        {path: "om_committeechangerecord", name: "OMCommitteeChangeRecord", navName: '委员会委员变更记录', type:1, component: OMCommitteeChangeRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织管理',navName: '委员会委员变更记录', type:1, activitiKey: 'MembersCommitteeChangeRecord',}
        },

        {path: "cm_goodworkplan", name: "CMGoodWorkPlan", navName: '“四好班子”工作规划', component: CMGoodWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '“四好班子”工作规划', type:1, activitiKey: 'SHBZWorkPlan',}
        },
        {path: "cm_goodworksummary", name: "CMGoodWorkSummary", navName: '“四好班子”工作总结', component: CMGoodWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '“四好班子”工作总结', type:1, activitiKey: 'SHBZWorkSummary',}
        },
        {path: "cm_inspectionrecord", name: "CMInspectionRecord", navName: '干部考察工作记录', component: CMInspectionRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '干部考察工作记录', type:1, activitiKey: 'GBKCWorkRecord',}
        },
        {path: "cm_performanceinspectionrecord", name: "CMPerformanceInspectionRecord", navName: '干部履职考察记录', component: CMPerformanceInspectionRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '干部履职考察记录', type:1, activitiKey: 'GBXCWorkRecord',}
        },
        {path: "cm_appointmentremovalrecord", name: "CMAppointmentRemovalRecord", navName: '干部任免工作记录', component: CMAppointmentRemovalRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '干部任免工作记录', type:1, activitiKey: 'GBRMWorkRecord',}
        },
        {path: "cm_rewardpunishmentrecord", name: "CMRewardPunishmentRecord", navName: '干部奖惩工作记录', component: CMRewardPunishmentRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'干部管理',navName: '干部奖惩工作记录', type:1, activitiKey: 'GBJCWorkRecord',}
        },

        {path: "le_educationplan", name: "LEEducationPlan", navName: '学习教育规划', component: LEEducationPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'学习教育',navName: '学习教育规划', type:1, activitiKey: 'LearnAndEducationPlanning',}
        },
        {path: "le_educationrecord", name: "LEEducationRecord", navName: '学习教育记录', component: LEEducationRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'学习教育', navName: '学习教育记录', type:1, activitiKey: 'LearnAndEducationRecord',}
        },
        {path: "le_educationsummary", name: "LEEducationSummary", navName: '学习教育总结', component: LEEducationSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'学习教育',navName: '学习教育总结', type:1, activitiKey: 'LearnAndEducationSummary',}
        },
        {path: "le_researcharticle", name: "LEResearchArticle", navName: '学习心得体会调研文章', component: LEResearchArticle, 
          meta: {type: 'nav-layout', showNav: true , superior:'学习教育',navName: '学习心得体会调研文章', type:1, activitiKey: 'LearnAndEducationArticalRecord',}
        },
        {path: "le_reportrecord", name: "LEReportRecord", navName: '调查研究报告记录', component: LEReportRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'学习教育',navName: '调查研究报告记录', type:1, activitiKey: 'investigationReportRecord',}
        },

        {path: "se_worklan", name: "SEWorkPlan", navName: '创先争优工作规划', component: SEWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'创先争优',navName: '创先争优工作规划', type:1, activitiKey: 'striveExcellenceWorkPlan',}
        },
        {path: "se_worksummary", name: "SEWorkSummary", navName: '创先争优工作总结', component: SEWorkSummary, 
          meta: {type: 'nav-layout',showNav: true , superior:'创先争优',navName: '创先争优工作总结', type:1, activitiKey: 'striveExcellenceWorkSummary',}
        },

        {path: "pc_workplan", name: "PCWorkPlan", navName: '宣传文化工作规划', component: PCWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '宣传文化工作规划', type:1, activitiKey: 'PropagandaCultureWorkPlan',}
        },
        {path: "pc_worksummary", name: "PCWorkSummary", navName: '宣传文化工作总结', component: PCWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '宣传文化工作总结', type:1, activitiKey: 'PropagandaCultureWorkSummary',}
        },
        {path: "pc_activityrecord", name: "PCActivityRecord", navName: '宣传文化活动记录', component: PCActivityRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '宣传文化活动记录', type:1, activitiKey: 'PropagandaCultureActivityRecord',}
        },
        {path: "pc_interviewrecord", name: "PCInterviewRecord", navName: '新闻媒体采访工作记录', component: PCInterviewRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '新闻媒体采访工作记录', type:1, activitiKey: 'newsMediaInterviewWorkRecord',}
        },
        {path: "pc_rublicsentimentrecord", name: "PCPublicSentimentRecord", navName: '舆情管控处置工作记录', component: PCPublicSentimentRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '舆情管控处置工作记录', type:1, activitiKey: 'YLGKWorkRecord',}
        },
        {path: "pc_politicalresearch", name: "PCPoliticalResearch", navName: '政研论文登记', component: PCPoliticalResearch, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '政研论文登记',  type:1,activitiKey: 'PoliticalResearchPaperRecord',}
        },
        {path: "pc_thoughtreport", name: "PCThoughtReport", navName: '职工思想分析报告', component: PCThoughtReport, 
          meta: {type: 'nav-layout', showNav: true , superior:'宣传文化',navName: '职工思想分析报告',  type:1,activitiKey: 'staffThoughtReport',}
        },

        {path: "ol_pc_lifeassociationrecord", name: "OLPCLifeAssociationRecord", navName: '党委民主生活会记录', component: OLPCLifeAssociationRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党委民主生活会记录', type:1, activitiKey: 'partyLifeMeetingRecord',}
        },
        {path: "ol_pm_conferencerecord", name: "OLPMConferenceRecord", navName: '党员大会会议记录', component: OLPMConferenceRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党员大会会议记录', type:1, activitiKey: 'PartyMemberMeetingRecord',}
        },
        {path: "ol_pb_committeemeetingrecord", name: "OLPBCommitteeMeetingRecord", navName: '党支部委员会会议记录', component: OLPBCommitteeMeetingRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党支部委员会会议记录', type:1, activitiKey: 'PartyBranchMeetingRecord',}
        },
        {path: "ol_pb_lifeassociationrecord", name: "OLPBLifeAssociationRecord", navName: '党支部民主生活会/专题组织生活会会议记录', component: OLPBLifeAssociationRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党支部民主生活会/专题组织生活会会议记录', type:1, activitiKey: 'partyLifeMeetingRecordTwo',}
        },
        {path: "ol_pg_meetingrecord", name: "OLPGMeetingRecord", navName: '党小组会议记录', component: OLPGMeetingRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党小组会议记录', type:1, activitiKey: 'PartyGroupMeetingRecord',}
        },
        {path: "ol_partylecturerecord", name: "OLPartyLectureRecord", navName: '党课记录', component: OLPartyLectureRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'组织生活',navName: '党课记录', type:1, activitiKey: 'partyLectureRecord',}
        },

        {path: "pmm_partymembersworkplan", name: "PMMPartyMembersWorkPlan", navName: '发展党员工作规划', component: PMMPartyMembersWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '发展党员工作规划', type:1, activitiKey: 'partyMembersWorkPlan',}
        },
        {path: "pmm_partymembersworksummary", name: "PMMPartyMembersWorkSummary", navName: '发展党员工作总结', component: PMMPartyMembersWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '发展党员工作总结', type:1, activitiKey: 'partyMemberWorkSummary',}
        },
        {path: "pmm_partymemberspersonalthought", name: "PMMPartyMembersPersonalThought", navName: '党员个人思想报告记录', component: PMMPartyMembersPersonalThought, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '党员个人思想报告记录', type:1, activitiKey: 'partyMemberThoughtReport',}
        },
        {path: "pmm_partymembersanalysisreport", name: "PMMPartyMembersAnalysisReport", navName: '党员思想分析报告记录', component: PMMPartyMembersAnalysisReport, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '党员思想分析报告记录', type:1, activitiKey: 'partyMemberThoughtAnalysisReport',}
        },
        {path: "pmm_partymembersawardsrecord", name: "PMMPartyMembersAwardsRecord", navName: '党员获奖情况记录', component: PMMPartyMembersAwardsRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '党员获奖情况记录', type:1, activitiKey: 'partyMemberAwardsRecord',}
        },
        {path: "pmm_partymembersviolationrecord", name: "PMMPartyMembersViolationRecord", navName: '党员违纪情况记录', component: PMMPartyMembersViolationRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理',navName: '党员违纪情况记录', type:1, activitiKey: 'partyMemberBreachPrincipleRecord',}
        },

        {path: "pmmo_ideologicalreport", name: "PMMOIdeologicalReport", navName: '思想汇报', component: PMMOIdeologicalReport, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理-党员义务',navName: '思想汇报', type:4,
          	activitiKeyList: [{name:'月度',key:'monthIdeologicalReport'},{name:'季度',key:'quarterlyThoughtReport'},{name:'年度',key:'yearThoughtReport'},{name:'其他',key:'otherThoughtReport'}],
      	  }
        },
        {path: "pmmo_workplan", name: "PMMOWorkPlan", navName: '工作规划', component: PMMOWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理-党员义务',navName: '工作规划', type:4,
          	activitiKeyList: [{name:'月度',key:'monthWorkPlan'},{name:'季度',key:'quarterlyWorkPlan'},{name:'年度',key:'yearWorkPlan'},{name:'其他',key:'otherWorkPlan'}],
      	  }
        },
        {path: "pmmo_worksummary", name: "PMMOWorkSummary", navName: '工作总结', component: PMMOWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理-党员义务',navName: '工作总结', type:4,
          	activitiKeyList: [{name:'月度',key:'monthWorkSummary'},{name:'季度',key:'quarterlyWorkSummary'},{name:'年度',key:'yearWorkSummary'},{name:'其他',key:'otherWorkSummary'}],
      	  }
        },
        {path: "pmmo_learningexperience", name: "PMMOLearningExperience", navName: '学习心得', component: PMMOLearningExperience, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员管理-党员义务',navName: '学习心得', type:4,
          	activitiKeyList: [{name:'月度',key:'monthLearnExperience'},{name:'季度',key:'quarterlyLearnExperience'},{name:'年度',key:'yearLearnExperience'},{name:'其他',key:'otherLearnExperience'}],
      	  }
        },

        {path: "chg_workplan", name: "CHGWorkPlan", navName: '党员违纪情况记录', component: CHGWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党风廉政工作规划', type:1, activitiKey: 'DFLZWorkPlan',}
        },
        {path: "chg_worksummary", name: "CHGWorkSummary", navName: '党风廉政工作总结', component: CHGWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党风廉政工作总结', type:1, activitiKey: 'DFLZWorkSummary',}
        },
        {path: "chg_dutypcreportrecord", name: "CHGDutyPCReportRecord", navName: '党委落实党风廉政建设主体责任情况报告记录', component: CHGDutyPCReportRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党委落实党风廉政建设主体责任情况报告记录', type:1, activitiKey: 'DFLZMainBodyBuildReport',}
        },
        {path: "chg_dutysignrecord", name: "CHGDutySignRecord", navName: '党风廉政建设责任书签订记录', component: CHGDutySignRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党风廉政建设责任书签订记录', type:1, activitiKey: 'DFLZResponsibilitySignRecord',}
        },
        {path: "chg_dutycheckrecord", name: "CHGDutyCheckRecord", navName: '党风廉政建设责任制考核记录', component: CHGDutyCheckRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党风廉政建设责任制考核记录', type:1, activitiKey: 'DFLZExaminationRecord',}
        },
        {path: "chg_dutyreportrecord", name: "CHGDutyReportRecord", navName: '党风廉政建设责任制落实情况报告记录', component: CHGDutyReportRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '党风廉政建设责任制落实情况报告记录', type:1, activitiKey: 'DFLZImplementationSituationRecord',}
        },
        {path: "chg_educationrecord", name: "CHGEducationRecord", navName: '廉洁从业警示教育活动记录', component: CHGEducationRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '廉洁从业警示教育活动记录', type:1, activitiKey: 'LJCYWarningEducationRecord',
          }
        },
        {path: "chg_promiserecord", name: "CHGPromiseRecord", navName: '领导人员廉洁从业承诺记录', component: CHGPromiseRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '领导人员廉洁从业承诺记录', type:1, activitiKey: 'LJCYCommitmentRecord',}
        },
        {path: "chg_debriefingrecord", name: "CHGDebriefingRecord", navName: '领导人员述职述廉报告记录', component: CHGDebriefingRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '领导人员述职述廉报告记录', type:1, activitiKey: 'LJCYLeaderTellAboutReportRecord',}
        },
        {path: "chg_opinionrecord", name: "CHGOpinionRecord", navName: '廉洁从业鉴定意见记录', component: CHGOpinionRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '廉洁从业鉴定意见记录', type:1, activitiKey: 'LJCYAppraisalOpinionRecord',}
        },
        {path: "chg_giftrecord", name: "CHGGiftRecord", navName: '礼品礼金上交工作记录', component: CHGGiftRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'党风廉政',navName: '礼品礼金上交工作记录', type:1,activitiKey: 'giftAndCashDeliveryWorkRecord',}
        },

        {path: "mw_workplan", name: "MWWorkPlan", navName: '群团工作工作规划', component: MWWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'群团工作',navName: '群团工作工作规划', type:1, activitiKey: 'MassWorkPlan',}
        },
        {path: "mw_worksummary", name: "MWWorkSummary", navName: '群团工作工作总结', component: MWWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'群团工作',navName: '群团工作工作总结', type:1, activitiKey: 'massWorkPlan',}
        },
        {path: "mw_activityrecord", name: "MWActivityRecord", navName: '党群共建活动记录', component: MWActivityRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'群团工作',navName: '党群共建活动记录', type:1, activitiKey: 'MassWorkActivityRecord',}
        },

        {path: "ht_activetalkrecord", name: "HTActiveTalkRecord", navName: '主动谈心工作记录', component: HTActiveTalkRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'谈心谈话',navName: '主动谈心工作记录', type:1, activitiKey: 'activeConversationWorkRecord',}
        },
        {path: "ht_honesttalkrecord", name: "HTHonestTalkRecord", navName: '廉洁从业谈话记录', component: HTHonestTalkRecord, 
          meta: {type: 'nav-layout', showNav: true , superior:'谈心谈话',navName: '廉洁从业谈话记录', type:1, activitiKey: 'LJCYTalkRecord',}
        },
        //******************工作记录统计数据 **************************************/
        {path: "result", name: "Result", navName: '工作记录数据', component: ResultIndex, 
          meta: {type: 'nav-layout', showNav: false},
          children: [
            {path: "", name: "generalAffairs" ,navName: '综合事务', component: ResultGeneralAffairs,
            meta: {type: 'nav-layout', showNav: true , resultType: 'generalAffairs'}
          },
            {path: "generalAffairs", name: "generalAffairs" ,navName: '综合事务', component: ResultGeneralAffairs,
              meta: {type: 'nav-layout', showNav: true,resultType: 'generalAffairs'}
            },
          ]
        },
        {path: "moreResult", name: "moreResultList" ,navName: '记录历史', component: moreResultIndex,
              meta: {type: 'nav-layout', showNav: true}
            },
        
      ]
      
    }, 
    //***************** 职工页面 ****************
    {
      path: '/staffandworkers', 
      // name: 'StaffAndWorkersIndex',
      component: StaffAndWorkersIndex,
      meta: {
        showNav: true,
        type: 'nav-layout'
      },
      children: [
        {path: "", name: "StaffAndWorkersHome", navName: '职工首页', component: StaffAndWorkersHome, meta: {type: 'nav-layout', showNav: true }},

        {path: "presettask", name: "StaffAndWorkersPresetTask", navName: '预设动作', component: StaffAndWorkersPresetTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "uptask", name: "StaffAndWorkersUpTask", navName: '上级任务', component: StaffAndWorkersUpTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtask", name: "StaffAndWorkersDownTask", navName: '下级任务', component: StaffAndWorkersDownTask, meta: {type: 'nav-layout', showNav: true }},
        {path: "downtaskdetail/:id", name: "StaffAndWorkersDownTaskDetail", navName: '下级任务-详情', component: StaffAndWorkersDownTaskDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "todolist", name: "StaffAndWorkersToDoList", navName: '待处理任务', component: StaffAndWorkersToDoList, meta: {type: 'nav-layout', showNav: true }},
        {path: "meeting", name: "SWMeetingTemp", navName: '会议', component: SWMeetingTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "topic", name: "SWTopicTemp", navName: '主题活动', component: SWTopicTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "hearttalk", name: "SWHeartTalkTemp", navName: '谈心谈话', component: SWHeartTalkTemp, meta: {type: 'nav-layout', showNav: true }},

        {path: "superiorreminder", name: "StaffAndWorkersSuperiorReminder", navName: '上级通知', component: StaffAndWorkersSuperiorReminder, meta: {type: 'nav-layout', showNav: true }},
        {path: "orgnotice", name: "StaffAndWorkersOrgNotice", navName: '下级通知', component: StaffAndWorkersOrgNotice, meta: {type: 'nav-layout', showNav: true }},
        {path: "message", name: "SAWMessage", navName: '党员信息', component: SAWMessage, meta: {type: 'nav-layout', showNav: true }},
        {path: "basicsmessage", name: "SAWBasicsMessage", navName: '基础信息', component: SAWBasicsMessage, meta: {type: 'nav-layout', showNav: true }},
        {path: "socialrelations", name: "SAWSocialRelations", navName: '社会关系', component: SAWSocialRelations, meta: {type: 'nav-layout', showNav: true }},
        {path: "experiencerecord", name: "SAWExperienceRecord", navName: '经历记录', component: SAWExperienceRecord, meta: {type: 'nav-layout', showNav: true }},
        {path: "getrecords", name: "SAWGetRecords", navName: '成果记录', component: SAWGetRecords, meta: {type: 'nav-layout', showNav: true }},
        {path: "collectionarticledetail/:article_id", name: "SAWCollectionArticleDetail", navName: '文章详情', component: SAWCollectionArticleDetail, meta: {type: 'nav-layout', showNav: true }},
      	{path: "typearticlelist/:key_type", name: "SAWTypeArticleList", navName: '文章分类列表', component: SAWTypeArticleList, meta: {type: 'nav-layout', showNav: true }},
      	{path: "articlelist/:type_id", name: "SAWArticleList", navName: '文章列表', component: SAWArticleList, meta: {type: 'nav-layout', showNav: true }},
        {path: "articledetail/:type_id/:article_id", name: "SAWArticleDetail", navName: '政策法规详情', component: SAWArticleDetail, meta: {type: 'nav-layout', showNav: true }},
        {path: "articleinformation", name: "SAWCollectionArticleInformation", navName: '文章资讯', component: SAWCollectionArticleInformation, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlinepartylectures", name: "SWOnlinePartyLecturesTemp", navName: '网上党课', component: SWOnlinePartyLecturesTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "pmexercisesexaminationpaper", name: "SWExercisesExaminationPaperTemp", navName: '习题试卷', component: SWExercisesExaminationPaperTemp, meta: {type: 'nav-layout', showNav: true }},
      	
      	{path: "integral", name: "SAWIntegral", navName: '我的积分', component: SAWIntegral, meta: {type: 'nav-layout', showNav: true }},
      	{path: "calender", name: "SAWCalender", navName: '签到日历', component: SAWCalender, meta: {type: 'nav-layout', showNav: true }},
      	{path: "onlinepartyschool", name: "SWOnlinePartySchoolTemp", navName: '网上党校', component: SWOnlinePartySchoolTemp, meta: {type: 'nav-layout', showNav: true }},
        {path: "onlineexamination", name: "SWOnlineExaminationTemp", navName: '在线考试', component: SWOnlineExaminationTemp, meta: {type: 'nav-layout', showNav: true }},

      	{path: "saw_activitiformcreate/:type/:key", name: "SAWActivitiFormCreate", navName: '流程自定义表单的创建页面', component: SAWActivitiFormCreate, meta: {type: 'nav-layout', showNav: true }},
        // ==== 流程自定义表单相关页面 ==== 
        // this.$route.meta  元数据 
        // meta.type  1-工作台的工作记录查询与创建 ；2-党员或职工的工作记录查询与创建 ；3-申请入党或申请转正、转预备的工作记录查询与申请录入 ；4-工作台党员义务的工作记录查询
        // 通过元数据，自定义配置流程表单所需的相关数据
        {path: "sawo_ideologicalreport", name: "SAWOIdeologicalReport", navName: '思想汇报', component: SAWOIdeologicalReport, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '思想汇报', type:2, 
          	activitiKeyList: [{name:'月度',key:'monthIdeologicalReport'},{name:'季度',key:'quarterlyThoughtReport'},{name:'年度',key:'yearThoughtReport'},{name:'其他',key:'otherThoughtReport'}],
      	  }
        },
        {path: "sawo_workplan", name: "SAWOWorkPlan", navName: '工作规划', component: SAWOWorkPlan, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '工作规划', type:2, 
          	activitiKeyList: [{name:'月度',key:'monthWorkPlan'},{name:'季度',key:'quarterlyWorkPlan'},{name:'年度',key:'yearWorkPlan'},{name:'其他',key:'otherWorkPlan'}],
      	  }
        },
        {path: "sawo_worksummary", name: "SAWOWorkSummary", navName: '工作总结', component: SAWOWorkSummary, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '工作总结', type:2, 
          	activitiKeyList: [{name:'月度',key:'monthWorkSummary'},{name:'季度',key:'quarterlyWorkSummary'},{name:'年度',key:'yearWorkSummary'},{name:'其他',key:'otherWorkSummary'}],
      	  }
        },
        {path: "sawo_learningexperience", name: "SAWOLearningExperience", navName: '学习心得', component: SAWOLearningExperience, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员义务',navName: '学习心得', type:2, 
          	activitiKeyList: [{name:'月度',key:'monthLearnExperience'},{name:'季度',key:'quarterlyLearnExperience'},{name:'年度',key:'yearLearnExperience'},{name:'其他',key:'otherLearnExperience'}],
      	  }
        },

        {path: "saws_joinparty", name: "SAWSJoinParty", navName: '入党申请', component: SAWSJoinParty, 
          meta: {type: 'nav-layout', showNav: true , superior:'党员服务',navName: '入党申请', type:3, activitiKey: 'partyApplication',}
        },

      ]
    },
    
  ]
})
