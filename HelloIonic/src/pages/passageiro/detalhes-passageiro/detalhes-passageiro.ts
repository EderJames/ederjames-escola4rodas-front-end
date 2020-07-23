import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { PaginaBase } from '../../../infraestrutura/PaginaBase';
import { FormBuilder } from '@angular/forms';
import { PassageiroModel } from '../../../models/PassageiroModel';
import { UsuarioModel } from '../../../models/UsuarioModel';
import { LocalPassageiroModel } from '../../../models/LocalPassageiroModel';
import { InstituicaoModel } from '../../../models/InstituicaoModel';
import { CriarLocaisPage } from '../../locais-passageiro/criar-local-passageiro/criar-locais';
import { LocalModel } from '../../../models/LocalModel';
import { TipoLocalPassageiro } from '../../../app/TipoLocalPassageiro';
import { CriarLocalInstituicaoPage } from '../../locais-instituicao/criar-local-instituicao/criar-local-instituicao';
import { InstituicaoServiceProvider } from '../../../providers/instituicao-service/instituicao-service';
import { PassageiroServiceProvider } from '../../../providers/passageiro-service/passageiro-service';
import { PassageiroInstituicaoModel } from '../../../models/PassageiroInstituicaoModel';

@IonicPage()
@Component({
  selector: 'page-detalhes-passageiro',
  templateUrl: 'detalhes-passageiro.html',
})

export class DetalhesPassageiroPage extends PaginaBase{

  passageiroModel : PassageiroModel;
  exibicaoBtnEditar: boolean;
  exibicaoBtnGravar: boolean;
  detalharPassageiro: boolean;
  locaisPassageiroEntrada: Array<LocalPassageiroModel>;
  locaisPassageiroSaida: Array<LocalPassageiroModel>;
  instituicoesDisponiveis: Array<InstituicaoModel>;
  passageiroInstituicaoDisponivel: Array<PassageiroInstituicaoModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl : AlertController, public loadingCtrl: LoadingController,
    public toastCtrl : ToastController, public formBulder: FormBuilder,
    public menuCtrl : MenuController, private instituicaoService: InstituicaoServiceProvider,
    private passageiroService: PassageiroServiceProvider) {
  
      super({formBuilder: formBulder, alertCtrl: alertCtrl, loadingCtrl: loadingCtrl, toastCtrl: toastCtrl});
      this.verificarCarregamentoTela();
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalhesPassageiroPage');
  }

  habilitarEdicao(){
    this.exibicaoBtnGravar = false;
    this.exibicaoBtnEditar = true;
    this.detalharPassageiro = false;
  }

  desabilitarEdicao(){
    this.exibicaoBtnGravar = true;
    this.exibicaoBtnEditar = false;
    this.detalharPassageiro = true;
  }

  verificarCarregamentoTela(){
    debugger
    this.passageiroModel = this.navParams.data.passageiro;
    this.locaisPassageiroEntrada = new Array<LocalPassageiroModel>();
    this.locaisPassageiroSaida = new Array<LocalPassageiroModel>();
    this.buscarInstituicoes();
    this.povoarLocalEntradaSaida();
    this.desabilitarEdicao();
  }

  buscarInstituicoes() {
    this.instituicaoService.listarInstituicoes().subscribe(
      resposta => {
        debugger;
        this.instituicoesDisponiveis = resposta;
        this.montarInstituicoesPassageiro();
      },
      erro => {
        this.mostrarMensagemErro("Não foi possível carregar as instituições disponíveis");
      });
  }

  povoarLocalEntradaSaida(){
    for(let i: number = 0; i < this.passageiroModel.locaisPassageiro.length; i++){
      if(this.passageiroModel.locaisPassageiro[i].Codigo_Tipo_Local == TipoLocalPassageiro.Local.Entrada){
        this.locaisPassageiroEntrada.push(this.passageiroModel.locaisPassageiro[i]);
      }
      else{
        this.locaisPassageiroSaida.push(this.passageiroModel.locaisPassageiro[i]);
      }
    }
  }

  adicionarLocalPartida(){
    this.navCtrl.push(CriarLocaisPage, {passageiro: this.passageiroModel, tipoLocal: 1});
  }

  adicionarLocalSaida(){
    this.navCtrl.push(CriarLocaisPage, {passageiro: this.passageiroModel, tipoLocal: 2});    
  }

  alocarAlunoEmInstituicao(){
    this.navCtrl.push(CriarLocalInstituicaoPage, {});
  }

  salvarDados(){
    debugger
    this.desabilitarEdicao();
    debugger
    this.passageiroService.atualizarPassageiro(this.passageiroModel).subscribe(
      resposta => {
        debugger
        this.esconderLoading();
        let teste = resposta;
      },
      erro => {
        debugger
        this.esconderLoading();
        this.mostrarMensagemErro(`Erro ao editar o passageiro: ${this.passageiroModel.usuario.Nome}`);
      });
  }

  montarInstituicoesPassageiro(){
    debugger
    this.passageiroInstituicaoDisponivel = new Array<PassageiroInstituicaoModel>()
    let passageiroInstituicao : PassageiroInstituicaoModel;

    if(this.instituicoesDisponiveis != null && this.instituicoesDisponiveis.length > 0){
      for(let i: number = 0; i < this.instituicoesDisponiveis.length; i++){
        passageiroInstituicao = new PassageiroInstituicaoModel();
        passageiroInstituicao.Codigo_Instituicao = this.instituicoesDisponiveis[i].Codigo;
        passageiroInstituicao.instituicao = this.instituicoesDisponiveis[i];
        //passageiroInstituicao.passageiro = this.passageiroModel;
        passageiroInstituicao.Codigo_Passageiro = this.passageiroModel.Codigo_Usuario;
        passageiroInstituicao.Codigo_Tipo_Passageiro = this.passageiroModel.tipoPassageiro;

        this.passageiroInstituicaoDisponivel.push(passageiroInstituicao);
      }
    }
  }

}
