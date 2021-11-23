# Personal Finance MGT. 

# DotNet Core API + Angular

Technology
----------
- .Net Core Web API

- XUnit - Unit Test

- EF Core - Code First - EF Transaction

- Repository pattern

- Sql Server

- Angular, Html, CSS, Javascript, Bootstrap


# Database

![DB Dia](https://user-images.githubusercontent.com/26190114/138147456-0ff12e8b-1dc7-46f6-967b-27b44942e4ec.PNG)



DB Tables
---------
    [sources]
    [accounts]
    [banks]
    [payees]
    [banktransactions] 
    [creditcardtransactions]    
    - db context: FMSContext.cs


DB Tables Relationship
----------------------

---> [Bank]-[Account] Relationship

	- (Bank)1------->0-*(Account)
	- (Account)1------->1(Bank)
  

---> [Bank]-[BankTransaction] Relationship

	- (Bank)1------->0-*(BankTransaction)
	- (BankTransaction)1------->1(Bank)
  

---> [Account]-[BankTransaction] Relationship

	- (Account)1------->0-*(BankTransaction)
	- (BankTransaction)1------->1(Account)
  

---> [Payee]-[BankTransaction] Relationship

	- (Payee)1------->0-*(BankTransaction)
	- (BankTransaction)1------->1(Payee)
  

---> [Source]-[BankTransaction] Relationship

	- (Source)1------->0-*(BankTransaction)
	- (BankTransaction)1------->1(Source)
  

---> [Payee]-[CreditCardTransaction] Relationship

	- (Payee)1------->0-*(CreditCardTransaction)
	- (CreditCardTransaction)1------->1(Payee)
  


---> exceptions handling

	  - Model validations are handled on Client(Angular - Component) and Server(Controller)  side
	  - all Server side exceptions are handled on Api - Controller / C# Service



# SYSTEM Diagram


![SYSTEM_Diagram](https://user-images.githubusercontent.com/26190114/130498428-5357a158-389a-4848-93f8-ee730b1fe22c.jpg)



# Screens

## Home->

![Home](https://user-images.githubusercontent.com/26190114/139503501-bac2d688-ee59-485c-b0c7-eeb96f4aedf8.PNG)


## Bank->

![Bank](https://user-images.githubusercontent.com/26190114/130495810-d984cb3c-ee15-47ea-8e89-797c4f6807fc.PNG)


![Bank Add](https://user-images.githubusercontent.com/26190114/130495830-005461b0-15fa-4797-b7ae-be63bd4e8f23.PNG)


![Bank Edit](https://user-images.githubusercontent.com/26190114/130495849-bc8ae8de-9476-43b5-b86d-f55963cf86f1.PNG)


## Account->

![Account](https://user-images.githubusercontent.com/26190114/130495869-5284c45b-8a06-4d92-90b1-fe93caf6bdac.PNG)


![Account Add](https://user-images.githubusercontent.com/26190114/130495877-8450ca3c-369b-4e70-a4ca-e490ec7cf6d5.PNG)


![Account Edit](https://user-images.githubusercontent.com/26190114/130495891-c816459f-feb6-48f2-a6f1-3a2ee74b880f.PNG)


![Source-Account-Transaction](https://user-images.githubusercontent.com/26190114/130496757-beec5eef-84d7-4dd9-ba33-0cf1a6785782.PNG)


## Payee->

![Payee](https://user-images.githubusercontent.com/26190114/130496002-ce7f1b9b-fdee-42b6-8fe0-9328d86b5b53.PNG)


![Payee-Add](https://user-images.githubusercontent.com/26190114/130496011-51318edb-1099-4d2e-84bb-b7cec7dd93fb.PNG)


![Pay-By-Credit-Card](https://user-images.githubusercontent.com/26190114/130496036-c5c37dce-fe6d-4f84-88f0-b8e6847bccf2.PNG)


![CreditCard-Payee-Transaction](https://user-images.githubusercontent.com/26190114/130496211-21aca458-5336-48e1-a6ec-e0d0ffe28da6.PNG)


## Account To Payee->

![Bank-Account](https://user-images.githubusercontent.com/26190114/130496518-88f9478a-6152-44b4-a5c9-c1cd1a7b39ac.PNG)


![Account-Payee-Transaction](https://user-images.githubusercontent.com/26190114/130496132-766717cb-39f7-462d-a677-5e7f4b95b8de.PNG)


![Account-Statement](https://user-images.githubusercontent.com/26190114/130496140-b18ddf6c-4793-4c50-bcbb-685c1aa19664.PNG)


## Reports->

![Account-Payee-All-Report](https://user-images.githubusercontent.com/26190114/130496874-5f2f7957-e158-4e4a-93c6-ad1dc7ecc1e9.PNG)


![Account-Payee-Report](https://user-images.githubusercontent.com/26190114/130496884-1af65b14-b584-45ae-b2a3-f09e64205a44.PNG)


![Account-All-Payee-Report](https://user-images.githubusercontent.com/26190114/130496898-fe832240-a9cc-429b-bdc8-d33cd0ed7063.PNG)


![Account-All-Payee-Report_Cont](https://user-images.githubusercontent.com/26190114/130496965-b070078e-1e72-43fb-9a58-aac05167e3d0.PNG)


![Account-All-Payee-All-Report](https://user-images.githubusercontent.com/26190114/130497007-7d998197-99af-470d-b69f-cea0e83f46f9.PNG)


![Account-All-Payee-All-Report_Cont](https://user-images.githubusercontent.com/26190114/130497015-2e09f3c1-d3a0-489f-b90e-e1c4d7e05cf4.PNG)


![Account-Payee-DateRange-Report](https://user-images.githubusercontent.com/26190114/130497037-334c913e-f92b-4869-bb64-2b2b0cbb8bbb.PNG)


![CreditCard-Payee-All-Report](https://user-images.githubusercontent.com/26190114/130497109-d8ac2eb1-b4f5-4251-961a-16f8943d320a.PNG)


![CreditCard-Payee-Report](https://user-images.githubusercontent.com/26190114/130497134-b8663c16-021c-45fa-8c80-0fbb60a73e06.PNG)


![CreditCard-Payee-DateRange-Report](https://user-images.githubusercontent.com/26190114/130497160-5ff56734-05f0-43b0-9f4b-f8b736aed7b5.PNG)


![CodingLength1](https://user-images.githubusercontent.com/26190114/139483139-5cbce66a-df9e-4dd7-b7fd-59879b2d47d0.PNG)


![CodingLength2](https://user-images.githubusercontent.com/26190114/139483157-2b74bc67-2c23-446d-8f65-5bcf188329a4.PNG)


![Monthly-Account-Monitor-Chart](https://user-images.githubusercontent.com/26190114/130497211-31294883-be5d-4299-8c45-99fa7e2784e8.PNG)


