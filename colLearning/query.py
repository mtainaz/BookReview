import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings
import pandas as pd

load_dotenv()
embeddings=OpenAIEmbeddings()
books_df=pd.read_csv("books_cleaned.csv")


query = "A book that spooks you"

res = embeddings.embed_query(query)

# Initialize Pinecone
pc=Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index=pc.Index("book-embeddings")

# get relevant results from pinecone
res = index.query(vector=res, top_k=2, include_metadata=True)
print(books_df[books_df["isbn13"]==int(res['matches'][0]["metadata"]["isbn"])])