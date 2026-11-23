from fastapi import FastAPI

app = FastAPI(title='SESSI Management System API')

@app.get('/')
def read_root():
    return {'message': 'Welcome to SESSI Integrated Management System API'}
