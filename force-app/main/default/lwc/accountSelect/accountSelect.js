import { LightningElement, wire } from 'lwc';
import GetAccounts from '@salesforce/apex/GetRecordsController.GetAccounts';
import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import mc from "@salesforce/messageChannel/KABBroadcast__c";

export default class AccountSelect extends LightningElement {
    context = createMessageContext();
    options=[];
    
    @wire(GetAccounts)
    gotAccounts(result) {
        if (result.data) {
            this.options=[];
            result.data.forEach(record => {
                this.options.push({label: record.Name, value: record.Id});
            });
        }
        else {
            console.log('error '+ JSON.stringify(result.error));
        }
    }

    accountChanged(event) {
        console.log('Account changed, event = ' + event);
        const accountId=event.detail.value;
        console.log('Value = ' + accountId);
        const message = {
            accountId: accountId
        };
        console.log('Message = ' + message);
        publish(this.context, mc, message);
        console.log('Published');
    }

    disconnectedCallback() {
        releaseMessageContext(this.context);
    }    
}