.PHONY: dev devw server server-windows web

dev:
	$(MAKE) -j2 server web

devw:
	$(MAKE) -j2 server-windows web

server-windows:
	cd server && .venv/Scripts/activate uvicorn.exe api.main:app --reload

server:
	cd server && source venv/bin/activate && uvicorn api.main:app --reload

web:
	cd web && npm run dev
