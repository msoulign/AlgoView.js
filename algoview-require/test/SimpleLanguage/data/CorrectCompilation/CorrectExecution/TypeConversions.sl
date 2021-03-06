PROCEDURE printValues(b : BOOLEAN, i : INTEGER, f : FLOAT, c : CHARACTER)
BEGIN
	PRINT(b)
	PRINT(" ")
	PRINT(i)
	PRINT(" ")
	PRINT(f)
	PRINT(" ")
	PRINTLN(c)
END

PROCEDURE printValuesWithCharacterAsInteger(b : BOOLEAN, i : INTEGER, f : FLOAT, c : CHARACTER)
VAR
	cAsInteger : INTEGER
BEGIN
	PRINT(b)
	PRINT(" ")
	PRINT(i)
	PRINT(" ")
	PRINT(f)
	PRINT(" ")
	cAsInteger <- c
	PRINTLN(cAsInteger)
END

PROCEDURE main()
VAR
	b : BOOLEAN
	i : INTEGER
	f : FLOAT
	c : CHARACTER
BEGIN
	// Booléen vers reste
	b <- TRUE
	i <- b
	f <- b
	c <- b
	printValuesWithCharacterAsInteger(b, i, f, c)
	
	b <- FALSE
	i <- b
	f <- b
	c <- b
	printValuesWithCharacterAsInteger(b, i, f, c)
	
	// Entier vers reste
	i <- 0
	b <- i
	f <- i
	c <- i
	printValuesWithCharacterAsInteger(b, i, f, c)
	
	i <- 42
	b <- i
	f <- i
	c <- i
	printValues(b, i, f, c)
	
	// Caractère vers reste
	c <- 'A'
	b <- c
	i <- c
	f <- c
	printValues(b, i, f, c)
END
