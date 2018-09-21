pipeline { // Declarative

    agent any

    stages {

       stage('Build') {

          steps {
             sh 'yarn'
             sh 'cp -R ./* /opt/server'
             sleep 30
             timeout(1) { // mins
                 waitUntil {
                     script {
                         def r = sh script: 'wget -q http://localhost:3000/version -O /dev/null', returnStatus: true
                         return (r == 0);
                     }
                 }
             }
          }

       }

    }

    post {
        success {
              emailext (
                  to: "johnphilipsolano@gmail.com, joebert.gian@gmail.com, ladera43@yahoo.com.ph, mjsolano12345@gmail.com",
                  subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                  body: """
                    <p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                    <p>Check the server application version at <a href='http://198.38.90.231:3000/version'>Server API version</a></p>
                    <pre>${currentBuild.changeSets}</pre>
                    """,
                  recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
        }
        failure {
              emailext (
                  to: "johnphilipsolano@gmail.com, joebert.gian@gmail.com, ladera43@yahoo.com.ph, mjsolano12345@gmail.com",
                  subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                  body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                    <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
                  recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
        }
    }
}