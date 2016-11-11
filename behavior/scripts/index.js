'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.addResponse('app:response:name:provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('app:response:name:provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    promt() {
      client.addResponse('app:response:name:greeting')
      client.addTextResponse('Hello world, I mean human')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    promt() {
      client.addResponse('app:response:name:goodbye')
      client.addTextResponse('See you later!')
      client.done();
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      greeting: 'greeting',
      goodbye: 'goodbye'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
      welcome: 'Hello earthling',
      goodbye: 'goodbye'
    },
    streams: {
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    },
  })
}
