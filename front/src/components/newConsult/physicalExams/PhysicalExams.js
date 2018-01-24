import React, { Component } from 'react';
import './PhysicalExams.css';
import Base64 from '../../../lib/base64';
import axios from 'axios';


class PhysicalExams extends Component {
  constructor(props){
    super(props);
        
		this.handleChange = this.handleChange.bind(this);

    this.state = {
			prepare: {},
			formData: {},
    };
  }

  componentWillMount() {
		axios.defaults.baseURL = 'https://31.220.54.251:8443/';
		axios.post(
			"prepare/physicalExams/",
			{}
		).then(
			function(response) {
				this.setState(
					{
						prepare: response.data.data,
					}
				);
			}
		).catch();

		this.setState(
			{
				prepare: {

					//var Exame_fisico = Object.create(Base);

					//Exame_fisico.types = {
						//void: {id: -1, label: "Vazio"},

						geral: {

							estado: "",

							//Tipos de edemas fisicos 
							edemas: // 1
							[ 
								{id: 0,label: "Sem Edema"},
								{id: 1,label: "+/++++"},
								{id: 2,label: "++/++++"},
								{id: 3,label: "+++/++++"},
								{id: 4,label: "++++/++++"},
							],

							//Auscutas respiratorias
							auscultas_resp: // 1
							[
								{id: 0,label: "Nenhum"},
								{id: 1,label: "MV Fisiológico"},
								{id: 2,label: "Creptações basais"},
								{id: 3,label: "Creptações difusas"},
							],

							refl_heptojugular:
							[
								{id: 0,label: "Sim"},
								{id: 1,label: "Não"},
							],

							turg_jugular:
							[
								{id: 0,label: "Sim"},
								{id: 1,label: "Não"},
							],

							ascite:
							[
								{id: 0,label: "Sim"},
								{id: 1,label: "Não"},
							],

							peso: 0.0,
							altura: 0.0,
							imc: 0.0, // peso/altura^2 

						},

						cardiovascular:{ 

							//Ritmo cardiovascular
							ritmo: // 1
							[
								{id: 0, label: "Regular"},
								{id: 1, label: "Irregular"},
							],

							//Inpecao cardiovascular
							inspecao: // 1
							[
								{id: 0, label: "Ictus Cordis Visivel"},
								{id: 1, label: "Ictus de VD"},
								{id: 2, label: "Movimento em bascula"},
							],

							//Bulhas
							bulhas: // 1
							[
								{id: 0, label: "B1 e B2"},
								{id: 1, label: "B3"},
								{id: 2, label: "B4"},
								{id: 3, label: "B3 e B4"},
							],

							auscuta: "",

							//Palpacao
							palpacao: // 1..*
							[
								{id: 0, label: "Ictus não palpável"},
								{id: 1, label: "Ictus palpável"},
								{id: 2, label: "Desviado E para Baixo"},
								{id: 3, label: "LHC 5 EIEC"},
							],

							fc: 0,

							pressao_arterial: 0,

						},

						bioquimico: {
							
							//Creatina
							creatina: // texto numerico
							{
								basal: 0.0,
								ultima: 0.0,
								delta: 0.0,
								clearence_atual: 0.0,
							},

							//Sangue
							sangue: // texto numerico
							{
								hemoglobina: 0.0,
								linfocitos: 0.0,
								sodio: 0.0,
								outros: "", // Plain Text
							},
						},

						complementar:{

							//ECG
							eletro: // 0..*
							[ 
								{id: 0, label: "Bloqueio de Ramo Direito (BRD)"},
								{id: 1, label: "Bloqueio de Ramo Esquerdo (BRE)"},
								{id: 2, label: "Supra do Segmento ST"},
								{id: 3, label: "Sobrecarga Atrial (SA)"},
								{id: 3, label: "Sobrecargo de Ventrículo (SV)"},
								{id: 3, label: "Flutter Atrial"},
								{id: 3, label: "Fibrilação Atrial (FA)"},
							],

							//Ecocardiograma
							primeira_FE: "", // texto numérico
							primeiro_VE_diast: "",
							primeiro_VE_sist: "",

							ultima_FE: "", // texto numérico
							ultima_VE_diast: "",
							ultima_VE_sist: "",		

							delta_FE: "", // diferença entre ultima_FE - primeira_FE
							delta_VE: "", // diferença entre ultima_VE_sist - primeira_FE_sist
							ps_ap: "", // texto numérico

						
					},
				},
			}
		);
	} 

  handleChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.value

		let formData = this.state.formData;
		
		if(target.type === 'checkbox') {
			if(target.checked) {
				/* insere */
				if(formData[name] == null) {
					formData[name] = [value];
				} else {
					formData[name].push(value);
				}
			} else {
				/* remove */
				let index = formData[name].indexOf(value);
				formData[name].splice(index, 1);
			}

		} else {
			formData[name] = value;
		}
		
		this.setState({
			formData: formData,
		});
		console.log("STATE", this.state);
	}	

	handleSubmit(event) {
		event.preventDefault();
		this.props.saveData("anamnese",this.state.formData);
	}

	render(){
		return(
			<div className="interventions">
				<h2>Exames Físicos</h2>

					<form onSubmit={ () => this.props.saveData("physicalExams",this.state.formData) }>
						
						<h3>Geral:</h3>

						<label htmlFor="state">Estado:</label>
						{console.log(this.state)}
						<textarea
							className="inputText"
							type="text"
							name="state"
							id="state"
							value={ this.state.prepare.geral.estado }
							onChange={ this.handleChange }
						/>
						<br/>
						
						<label htmlFor="edemas">Edemas</label>
						<select name="edema" id="edema" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{	
								this.state.prepare.geral.edemas.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

						<label htmlFor="ascultas_respiratórias">Ascultas respiratorias</label>
						<select name="ascultas_respiratorias" id="ascultas_respiratorias" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{
								this.state.prepare.geral.auscultas_resp.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

						<h3>Cardiovascular:</h3>

						<label htmlFor="ritmo">Ritmo</label>
						<select name="ritmo" id="ritmo" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{
								this.state.prepare.cardiovascular.ritmo.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

						<label htmlFor="inspecao">Inspeção cardiovascular</label>
						<select name="inspecao" id="inspecao" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{
								this.state.prepare.cardiovascular.inspecao.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

						<label htmlFor="bulhas">Bulhas</label>
						<select name="bulhas" id="bulhas" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{
								this.state.prepare.cardiovascular.bulhas.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

						<label htmlFor="palpacao">Palpação</label>
						<select name="palpacao" id="palpacao" onChange={ this.handleChange }>
							<option value="">-- Escolher --</option>
							{
								this.state.prepare.cardiovascular.palpacao.map(
									(row) => {
										return (
											<option key={ row.id } value={ row.id }>{ row.label }</option>
										);
									}
								)						
							}
						</select>
						<br/>

					</form>
					
			</div>
		)
	}
}

export default PhysicalExams;