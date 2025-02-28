from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import json
from pinecone import Pinecone
import os
import sys

load_dotenv()

embeddings=OpenAIEmbeddings()

# Initialize Pinecone
pc=Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index=pc.Index("book-embeddings")

def retrieve_semantic_recommendations(
        query: str,
        initial_top_k: int=50,
)->dict:
    query_res=embeddings.embed_query(query)
    recs = index.query(vector=query_res, top_k=initial_top_k, include_metadata=True)
    books_list={rec["metadata"]["isbn"]:rec["score"] for rec in recs["matches"]}

    return json.dumps(books_list)


if __name__ == "__main__":
    query=sys.argv[1]
    print(retrieve_semantic_recommendations(query))
