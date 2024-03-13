/* eslint-disable no-console */
import { LightningElement, api } from 'lwc';
import { createMessageContext, releaseMessageContext,
         publish } from 'lightning/messageService';
import mc from "@salesforce/messageChannel/KABBroadcast__c";
export default class Publisher extends LightningElement {
    context = createMessageContext();
    @api recordId;
    
    publishMC() {
        console.log('In publishMC, record id = ' + this.recordId);
        const message = {
            recordId: this.recordId,
            recordData: { value: "some value" }
        };
        publish(this.context, mc, message);
        console.log('Published!');
    }
    
    disconnectedCallback() {
        releaseMessageContext(this.context);
    }    
}