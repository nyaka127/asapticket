import requests
import random
import time
import concurrent.futures

# Configuration
BASE_URL = "http://localhost:3000" # Update to your Vercel URL if testing live
TOTAL_CLIENTS = 500
US_AIRPORTS = ["JFK", "LAX", "MIA", "SFO", "ORD", "DFW", "ATL", "SEA"]

def simulate_participation(client_id):
    """Simulates a US client searching for flights and submitting a lead."""
    try:
        origin = random.choice(US_AIRPORTS)
        dest = random.choice([a for a in US_AIRPORTS if a != origin])
        
        # 1. Simulate Search Participation
        print(f"[Client {client_id}] Searching {origin} -> {dest}...")
        search_res = requests.get(f"{BASE_URL}/api/flights/search?origin={origin}&destination={dest}")
        
        # Random delay to simulate browsing
        time.sleep(random.uniform(0.5, 2.0))
        
        # 2. Simulate Interaction (Clickstream)
        requests.post(f"{BASE_URL}/api/monitor", json={
            "action": f"Participation: Client {client_id} Browsing {origin} route",
            "source": "Simulation"
        })
        
        # 3. Simulate Lead Submission (Expert Service Request)
        if random.random() > 0.5:
            print(f"[Client {client_id}] Submitting Lead for {dest} Hub...")
            requests.post(f"{BASE_URL}/api/leads", json={
                "name": f"US Client {client_id}",
                "email": f"client{client_id}@example.us",
                "phone": f"+1{random.randint(2000000000, 9999999999)}",
                "pref": "WhatsApp",
                "origin": origin,
                "destination": dest,
                "departureDate": "2026-04-15",
                "cabin": "ECONOMY",
                "deposit": True if random.random() > 0.7 else False
            })
            
        return True
    except Exception as e:
        print(f"[Client {client_id}] Error: {e}")
        return False

def main():
    print(f"🚀 Initializing Global Scale Test: {TOTAL_CLIENTS} US Clients...")
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(simulate_participation, range(1, TOTAL_CLIENTS + 1)))
    
    success_count = results.count(True)
    duration = time.time() - start_time
    print(f"\n✅ Scale Test Complete!")
    print(f"Total Success: {success_count}/{TOTAL_CLIENTS}")
    print(f"Total Time: {duration:.2f}s")
    print(f"Average RPS: {TOTAL_CLIENTS/duration:.2f}")

if __name__ == "__main__":
    main()
