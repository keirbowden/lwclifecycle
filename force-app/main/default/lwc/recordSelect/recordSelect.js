import { LightningElement, api, wire } from 'lwc';
import GetRecords from '@salesforce/apex/GetRecordsController.GetRecords';
import { createMessageContext, releaseMessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import mc from "@salesforce/messageChannel/KABBroadcast__c";

export default class RecordSelect extends LightningElement {
    context = createMessageContext();
    subscription = null;

    options=[];
    accountId=null;
    @api sobjectType;

    @wire(GetRecords, {accountId : '$accountId', sobjectType: '$sobjectType'})
    gotRecords(result) {
        if (result.data) {
            this.options=[];
            result.data.forEach(record => {
                this.options.push({label: record.Name, value: record.Name});
            });
        }
    }

    connectedCallback() {
        this.subscribeMC();
    }

    disconnectedCallback() {
        releaseMessageContext(this.context);
        console.log('disconnected callback invoked');
    }

    subscribeMC() {
        console.log('In subscribe - account id = ' + this.accountId);
       if (this.subscription) {
         return;
       }
       console.log('At 1');
       this.subscription = subscribe(this.context, mc, (message) => {
           this.handleMessage(message);
       },
       { scope: APPLICATION_SCOPE });
       console.log('At 2');
    }
  
    handleMessage(message) {
        this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
        console.log('Received message ' + JSON.stringify(message, null, 4));
        this.accountId=message.accountId;
    }


}