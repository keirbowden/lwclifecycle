public with sharing class GetRecordsController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> GetRecords(Id accountId, String sobjectType) 
    {
        List<Sobject> records=null;
        
        if (null!=accountId) {
            String queryStr='select id, Name from ' + sobjecttype + ' where AccountId=:accountId';

            System.debug('Query string = ' + queryStr);
            records=Database.query(queryStr);

        }
        return records;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> GetAccounts() 
    {
        return [select id, Name from Account];
    }
}
