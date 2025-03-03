from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import pandas as pd
import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec

load_dotenv()
books=pd.read_csv("books_cleaned.csv")
books["tagged_description"].to_csv("tagged_description.txt",
                                   sep = "\n",
                                   index = False,
                                   header = False)

raw_documents = TextLoader("tagged_description.txt", encoding="utf-8").load()
text_splitter = CharacterTextSplitter(chunk_size=0, chunk_overlap=0, separator="\n")
documents = text_splitter.split_documents(raw_documents)

# Initialize OpenAI Embeddings
embeddings = OpenAIEmbeddings()

# Initialize Pinecone
pc=Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create pinecone index
index_name = "book-embeddings"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536,  # dimensionality of text-embedding-ada-002
        metric="cosine", 
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ) 
    )

# Connect to the Pinecone index
index = pc.Index(index_name)

# Compute and store embeddings
vectors = []
for i, doc in enumerate(documents):
    embedding = embeddings.embed_query(doc.page_content)  # Generate embedding
    vectors.append((str(i), embedding, {"isbn": doc.page_content.strip('"').split()[0]}))  # Store metadata i.e. isbn

# Insert into Pinecone
batch_size = 200 # Max batch size based on vector dimension
for i in range(0, len(vectors), batch_size):
    batch = vectors[i : i + batch_size]
    index.upsert(batch)

# query="A book to teach children about nature"
# docs=db_books.similarity_search(query, k=10) #Get 10 results
# print(docs[0])


