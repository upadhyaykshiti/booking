
import chromadb
from sentence_transformers import SentenceTransformer

# Initialize Chroma client
chroma_client = chromadb.Client()

# Create or get collection
try:
    collection = chroma_client.get_collection("patient_notes")
except:
    collection = chroma_client.create_collection(name="patient_notes")

# Initialize SentenceTransformer model (PyTorch)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Helper function: embed text
def embed_text(text: str):
    return model.encode(text).tolist()  # Convert to list for ChromaDB

# Add a patient note
def add_patient_note(patient_id: str, note: str):
    embedding = embed_text(note)
    collection.add(
        ids=[patient_id],
        metadatas=[{"note": note}],
        embeddings=[embedding]
    )

# Search notes semantically
def search_notes(query: str, top_k: int = 5):
    query_embedding = embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results
