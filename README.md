### Preparatory actions on the Dasha side
 
Make sure you have node.js version 13+ and npm installed. You will also want the latest version of Visual Studio Code running to edit and test the Dasha app.
1. Join [Dasha Community](https://community.dasha.ai) - you will get your API key here automatically
2. Open VSCode and install the [Dasha Studio Extension](https://marketplace.visualstudio.com/items?itemName=dasha-ai.dashastudio&ssr=false) from the extension store.  You’ll get all the DSL syntax highlighting and a GUI interface for debugging your conversation flow.
3. Run __`npm i -g "@dasha.ai/cli@latest"`__ to install the latest Dasha CLI.
 
You’ll want to load up a Dasha conversational AI app. For the purposes of this tutorial, you may want to load up either the [inbound tester app](https://github.com/dasha-samples/dasha-sip-test) for inbound calls.  Or the [outbound tester app](https://dasha.ai/en-us/blog/customer-feedback-survey) for outbound calls. 
 
## Setting things up on the side of Voximplant (telephony vendor) 
 
1. [Login to your Voximplant account](https://manage.voximplant.com/auth) or [create an account](https://manage.voximplant.com/auth/sign_up) if you don’t have one.
2. Create a Voximplant [application](https://manage.voximplant.com/applications).
3. Purchase a Voximplant phone number in the [Numbers](https://manage.voximplant.com/numbers/my_numbers) section of the control panel and attach it to the app. This number will be used as callerid. 
4. Go to your [applications](https://manage.voximplant.com/applications), click on the app you had created. Click on Numbers > Available and "attach". This number will be used as __callerid__. 

### For Outbound calls: 
Go to Scenarios > Create Scenario, name the Scenario and hit the “plus” sign. You will need to paste the code below in the scenario. 

 
```javascript
    const callerid = 'number_you_bought'
    VoxEngine.addEventListener(AppEvents.CallAlerting,(e) => {
        Logger.write('a call from ' + e.callerid);
    // an inbound SIP call from Dasha (the first call leg)
        const inc = e.call;
    // an outbound call to PSTN (the second call leg)
        const out = VoxEngine.callPSTN(e.destination, callerid);
        out.addEventListener(CallEvents.Connected, () => {
    // answering the call
            inc.answer();
        })
        // adding default event listeners to pass signaling information between two calls
        VoxEngine.easyProcess(out, inc);
    })
```

This scenario be run from the Dasha integration. On an incoming SIP call from Dasha, the phone number which we want to call is passed to the callPSTN method. This is how we connect two calls. Once the call is answered, Dasha will start the conversation. If you want to handle inbound calls to SIP, use your SIP URI as __`callerid`__ and replace the [callPSTN](https://voximplant.com/docs/references/voxengine/voxengine/callpstn) method with [callSIP](https://voximplant.com/docs/references/voxengine/voxengine/callsip). If you are using SIP Registrations on your PBX, you need to create a SIP Registration and use it instead of the SIP URI.

Next,go to the __Users__ section and create a new user. Remember the username and password, they will be used for Dasha's config in the next step.

Now, click on __Routing__ in the left hand menu. Create a new rule (leave the pattern as default), and attach your scenario to this rule.
 

 
Connect your sip trunk with Dasha's using this command:
 
```bash
dasha sip create-outbound --server <ip_or_dns_of_server:port> [--domain <domain_name>] [--ask-password] --account <accountName> --transport [tcp|udp] <config_name>
```
- `accountName` is the username you created in the Voximplant panel;
- `ip_or_dns_of_server:port` is the name of our Voximplant app;
- `config_name` is the name of the config we’ll use in the next step.
 
For example:
```bash
dasha sip create-outbound --server exampleApp.exampleAcc.n4.voximplant.com --account exampleUsername --ask-password vox_outbound
 
password: enter_your_password_here
```
 
dasha sip create-outbound --server testapp.arthur-dasha-test.n4.voximplant.com --account arthur-dasha-test --ask-password vox_outbound2
 
## Get your backend in order and start calling 
 
The setup is ready, now we need a local app or backend to run our Voximplant scenario using Dasha.
 
### Placing outbound calls: 
 
Open your VS Code Dasha conversational AI app project. Open up __index.js__ file and replace **configName** in __`dasha.sip.Endpoint`__ with your config name. Do the same with the __`name`__ field in package.json. To see all the available configs for sip outbound, run the __`dasha sip list-outbound`__ command.
 
In the __*.dashaapp__ file, change the __`name`__ field so it matches our config name.
 
For __outbound calls__, run: __`node index.js <the number to call in international format e.g. 12223334455>`__. Now you can watch the application deployment and registration process in the console.
 
## In conclusion 
 
Congrats, you’ve successfully connected your Dasha conversational AI app to your custom telephony. This is exciting. You can now call anyone in the world. 
If you haven’t yet, you can join [Dasha community](https://community.dasha.ai) and let us know how useful this was to you. If you want a super quick answer - ask your questions on [StackOverflow](https://stackoverflow.com), using the #dasha hashtag. 