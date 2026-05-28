.PHONY: dev server web

dev:
	$(MAKE) -j2 server web

server:
	cd server && source venv/bin/activate && uvicorn api.main:app --reload

web:
	cd web && npm run dev
