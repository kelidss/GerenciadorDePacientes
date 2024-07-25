from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv
import datetime

# Carregar arquivo dotenv
load_dotenv()

# Conexao para o BD PostgreSQL
DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@localhost/{os.getenv('POSTGRES_DB')}"

# Configs do Flask e SQLAlchemy
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    medical_history = db.Column(db.Text, nullable=False)

    def json(self):
        today = datetime.datetime.today()
        age = today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
        return {
            "id": self.id,
            "name": self.name,
            "birth_date": self.birth_date,
            "age": age,
            "address": self.address,
            "phone": self.phone,
            "email": self.email,
            "medical_history": self.medical_history
        }


class Visit(db.Model):
    __tablename__ = 'visits'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    visit_date = db.Column(db.Date, nullable=False)
    summary = db.Column(db.Text, nullable=False)

    patient = db.relationship('Patient', backref=db.backref('visits', lazy=True))

    def json(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "visit_date": self.visit_date,
            "summary": self.summary
        }


@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.json() for patient in patients])

@app.route('/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    new_patient = Patient(
        name=data['name'],
        birth_date=datetime.datetime.strptime(data['birth_date'], '%Y-%m-%d'),
        address=data['address'],
        phone=data['phone'],
        email=data['email'],
        medical_history=data['medical_history']
    )
    db.session.add(new_patient)
    db.session.commit()
    return jsonify(new_patient.json()), 201

@app.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):
    data = request.get_json()
    patient = Patient.query.get_or_404(id)

    patient.name = data['name']
    patient.birth_date = datetime.datetime.strptime(data['birth_date'], '%Y-%m-%d')
    patient.address = data['address']
    patient.phone = data['phone']
    patient.email = data['email']
    patient.medical_history = data['medical_history']

    db.session.commit()
    return jsonify(patient.json())

@app.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    patient = Patient.query.get(id)

    if patient:
        # deleta visitantes conectados ao paciente
        visits = Visit.query.filter_by(patient_id=id).all()
        for visit in visits:
            db.session.delete(visit)

        db.session.delete(patient)
        db.session.commit()
        return '', 204
    else:
        return '', 404


@app.route('/visits', methods=['POST'])
def add_visit():
    data = request.get_json()
    new_visit = Visit(
        patient_id=data['patient_id'],
        visit_date=datetime.datetime.strptime(data['visit_date'], '%Y-%m-%d'),
        summary=data['summary']
    )
    db.session.add(new_visit)
    db.session.commit()
    return jsonify(new_visit.json()), 201

@app.route('/patients/<int:id>/visits', methods=['GET'])
def get_patient_visits(id):
    visits = Visit.query.filter_by(patient_id=id).all()
    return jsonify([visit.json() for visit in visits])

@app.route('/visits/<int:visit_id>', methods=['DELETE'])
def delete_visit(visit_id):
    visit = Visit.query.get(visit_id)

    if visit:
        db.session.delete(visit)
        db.session.commit()
        
        return '', 204
    else:
        return '', 404

# Ao rodar, criar as tabelas se nao existirem
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=False)
