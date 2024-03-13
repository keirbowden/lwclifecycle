public with sharing class InfiniteScrollController 
{
    @AuraEnabled
    public static List<Account> GetNextAccounts(Integer startPos) 
    {
        List<Account> accs=[select id, Name, NumberOfEmployees, Industry
                            from Account
                            limit 10
                            offset :startPos];

        return accs;
    }
}
