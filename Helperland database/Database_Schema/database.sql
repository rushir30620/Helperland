//creating database
CREATE DATABSE helperland;

//creating User table
CREATE TABLE customer(
    id INTEGER NOT NULL PRIMARY KEY, 
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(60) NOT NULL,
    mobile INTEGER NOT NULL,
    dateofbirth DATE,
    preferredLanguage VARCHAR(20),
    password VARCHAR(50)
);

CREATE TABLE contact_us(
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(60) NOT NULL,
    mobile INTEGER,
    subject VARCHAR(10),
    message VARCHAR(500)
);

CREATE TABLE serviceProviderDetails(
    id INTEGER NOT NULL PRIMARY KEY, 
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(60) NOT NULL,
    mobile INTEGER NOT NULL,
    password VARCHAR(50),
    dateofbirth DATE,
    nationality VARCHAR(30),
    gender VARCHAR(10),
    avatar VARCHAR(10),
    streetname VARCHAR(30),
    housenumber INTEGER,
    postalcode INTEGER,
    city VARCHAR(30)
);

CREATE TABLE customerAddressDetails(
    addressID INTEGER NOT NULL PRIMARY KEY,
    custId INTEGER FOREIGN KEY REFERENCES customer(id),
    customerEmail VARCHAR(60),
    streetName VARCHAR(30),
    houseNumber INTEGER,
    postalcode INTEGER,
    city VARCHAR(30),
    phoneNumber INTEGER
);

CREATE TABLE blockList(
    blockerEmail VARCHAR(60),
    blockingEmail VARCHAR(60)
);

CREATE TABLE favouriteSp(
    custID INTEGER FOREIGN KEY REFERENCES customer(id),
    spId INTEGER FOREIGN KEY REFERENCES serviceProviderDetails(id)
);

CREATE TABLE ServiceRequestDetails
(
	ServiceId INT PRIMARY KEY,
	CustomerEmail VARCHAR(60),
	SPEmail VARCHAR(60),
	DateOfService DATE NULL,
	ServiceStartTime TIME NULL,
	ServiceDuration FLOAT NULL,
	PaymentAmount INT NULL,
	RefundAmount INT NULL,
	RefundReason VARCHAR(100) NULL,
	Status VARCHAR(20) NULL,
	Pets BIT NULL,
	ExtraServices VARCHAR(100) NULL,
	Distance FLOAT NULL,
	addressID INT FOREIGN KEY REFERENCES customerAddressDetails(addressID),
	OverallRating INT NULL,
	OnTimeRating INT NULL,
	FriendlyRating INT NULL,
	QualityOfServiceRating INT NULL,
	Feedback VARCHAR(100) NULL,
	CalcelledReason VARCHAR(100) NULL,
	Comment VARCHAR(100) NULL
) 