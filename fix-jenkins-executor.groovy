import jenkins.model.*
import hudson.model.*

def jenkins = Jenkins.getInstance()

// Set the number of executors for the master node
jenkins.setNumExecutors(2)

// Get the master node and configure it
def masterNode = jenkins.getNode("")
if (masterNode != null) {
    masterNode.setNumExecutors(2)
}

// Save the configuration
jenkins.save()

println "Jenkins executor configuration updated!"
println "Number of executors set to: 2"
println "Jenkins will now be able to run builds"