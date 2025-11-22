import jenkins.model.*
import hudson.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM
import hudson.plugins.git.BranchSpec
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.impl.*
import org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl
import hudson.util.Secret

def jenkins = Jenkins.getInstance()

// Create credentials for Docker Hub
def domain = Domain.global()
def store = jenkins.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

// Docker Hub credentials
def dockerHubCredentials = new UsernamePasswordCredentialsImpl(
    CredentialsScope.GLOBAL,
    "dockerhub-credentials",
    "Docker Hub Credentials",
    "maheshsingh20", // Replace with your Docker Hub username
    "YOUR_DOCKER_HUB_PASSWORD" // You'll need to replace this with your actual password
)

// Check if credentials already exist
def existingCreds = store.getCredentials(domain).find { it.id == "dockerhub-credentials" }
if (!existingCreds) {
    store.addCredentials(domain, dockerHubCredentials)
    println "Docker Hub credentials added"
} else {
    println "Docker Hub credentials already exist"
}

// Create the pipeline job
def jobName = "CodeAndChill-CI-CD"
def job = jenkins.getItem(jobName)

if (job == null) {
    job = jenkins.createProject(WorkflowJob, jobName)
    println "Created new job: ${jobName}"
} else {
    println "Job already exists: ${jobName}"
}

// Configure the job
def scm = new GitSCM("https://github.com/maheshsingh20/CodeChill.git") // Replace with your GitHub repo URL
scm.branches = [new BranchSpec("*/main")]

def definition = new CpsScmFlowDefinition(scm, "Jenkinsfile")
definition.setLightweight(true)

job.setDefinition(definition)
job.setDescription("Automated CI/CD pipeline for CodeAndChill application")

// Set environment variables
def parameterDefinitions = []
parameterDefinitions.add(new StringParameterDefinition("DOCKER_USERNAME", "maheshsingh20", "Docker Hub username"))

def parametersAction = new ParametersDefinitionProperty(parameterDefinitions)
job.addProperty(parametersAction)

// Save the job
job.save()
jenkins.reload()

println "Jenkins job '${jobName}' configured successfully!"
println "Please update the Docker Hub password in the credentials manually through Jenkins UI"
println "Job URL: http://localhost:8081/job/${jobName}/"