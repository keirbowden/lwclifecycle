/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import GetNextAccounts from '@salesforce/apex/InfiniteScrollController.GetNextAccounts';

export default class InfiniteScroll extends LightningElement {
    @track accounts=[];
    startPos=0;
    accountsDiv=null;
    initialised=false;
    @track loading=false;

    scrollCallback = (ev) => {
        console.log('Inner = ' + this.accountsDiv.clientHeight + ', Y = ' +  Math.ceil(this.accountsDiv.scrollTop) + ', height=' + this.accountsDiv.scrollHeight);
            if ((this.accountsDiv.clientHeight + Math.ceil(this.accountsDiv.scrollTop)) >= this.accountsDiv.scrollHeight) {
                this.accountsDiv.removeEventListener('scroll', this.scrollCallback);
                this.loadMoreAccounts();
            }
    }

    connectedCallback() {
        console.log('Connected callback invoked');
    }

    disconnectedCallback() {
        this.accountsDiv.removeEventListener('scroll', this.scrollCallback);
        console.log('disconnected callback invoked');
    }

    renderedCallback() {
        if (!this.initialised) {
            this.accountsDiv=this.template.querySelector('div.accounts');
            this.loadMoreAccounts();        
            this.initialised=true;
        }
    }

    loadMoreAccounts() {
        this.loading=true;
        GetNextAccounts({startPos: this.startPos})
            .then(result => {
                this.accounts=this.accounts.concat(result);
                this.startPos=this.accounts.length;
                if (result.length===10) {
                    this.accountsDiv.addEventListener('scroll', this.scrollCallback);
                }
            })
            .catch(error => {
                alert('Error occurred ' + JSON.stringify(error));
            })
            .finally(() => {
                this.loading=false;
            });
    }
}