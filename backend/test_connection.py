import truststore
truststore.inject_into_ssl()

import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from neo4j.debug import watch


load_dotenv()

uri = os.getenv("NEO4J_URI")
username = os.getenv("NEO4J_USERNAME")
password = os.getenv("NEO4J_PASSWORD")
database = os.getenv("NEO4J_DATABASE", "neo4j")

print("Testing Neo4j connection...")
print("Password configured:", bool(password))

try:
    with watch("neo4j"):
        with GraphDatabase.driver(
            uri,
            auth=(username, password),
            connection_timeout=15
        ) as driver:
            driver.verify_connectivity()
            print("Connection successful!")

            with driver.session(database=database) as session:
                result = session.run(
                    "MATCH (n) RETURN count(n) AS total"
                )
                print("Total nodes:", result.single()["total"])

except Exception as e:
    print("ERROR TYPE:", type(e).__name__)
    print("ERROR MESSAGE:", str(e))
