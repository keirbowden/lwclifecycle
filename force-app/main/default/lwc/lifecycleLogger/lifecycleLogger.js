/* eslint-disable no-console */
import { LightningElement, track, api } from 'lwc';

import { createMessageContext, releaseMessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import mc from "@salesforce/messageChannel/KABBroadcast__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

    
export default class LifecycleLogger extends LightningElement {
    context = createMessageContext();
    subscription = null;
    @track receivedMessage = '';
    @api recordId;
  
    constructor() {
        super();
        console.log('Constructor called');
    }

    connectedCallback() {
        console.log('Connected callback invoked');
    }

    disconnectedCallback() {
        releaseMessageContext(this.context);
        console.log('disconnected callback invoked');
    }

    renderedCallback() {
        console.log('Rendered callback invoked');
    }

    subscribeMC() {
        console.log('In subscribe - record id = ' + this.recordId);
       if (this.subscription) {
        this.showToast('Error', 'You already did that!');
        return;
       }
       console.log('At 1');
       this.subscription = subscribe(this.context, mc, (message) => {
           this.handleMessage(message);
       },
       { scope: APPLICATION_SCOPE });
       console.log('At 2');
       this.showToast('Success', 'Subscribed to channel');
    }
  
    unsubscribeMC() {
        unsubscribe(this.subscription);
        this.subscription = null;
        this.showToast('Success', 'Unsubscribed from channel');
    }

    handleMessage(message) {
        this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
        console.log('Received message ' + JSON.stringify(message, null, 4));
        if (message.recordId!==this.recordId) {
            console.log('Not for me!');
        }
    }

    showToast(title, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message
        });
        this.dispatchEvent(event);
    }
}