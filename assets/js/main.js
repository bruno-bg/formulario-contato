document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado. Inicializando formulário...');

  const inputs = document.querySelectorAll(".input");

  // Mantém o foco nos campos e atualiza visual
  function focusFunc() {
    let parent = this.parentNode;
    parent.classList.add("focus");
  }

  // Verifica se o campo está vazio quando perde o foco
  function blurFunc() {
    let parent = this.parentNode;
    if (this.value == "") {
      parent.classList.remove("focus");
    } else {
      // Garante que o campo mantém o foco visual se tiver conteúdo
      parent.classList.add("focus");
      
      // Validar o campo quando perder o foco (com valor)
      if (this.name) {
        validarCampoIndividual(this);
      }
    }
  }

  // Adiciona eventos para todos os inputs
  inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
    
    // Se já tiver algum valor ao carregar a página (ex: após um refresh)
    if (input.value !== "") {
      input.parentNode.classList.add("focus");
    }
    
    // Validar enquanto digita para todos os campos
    input.addEventListener("input", function() {
      if (this.value !== "") {
        this.parentNode.classList.add("focus");
        
        // Validação em tempo real para todos os campos
        validarCampo(this, false); // validação silenciosa (sem alerta)
      } else {
        // Se o campo ficar vazio, remove a classe de erro
        this.parentNode.classList.remove("error");
      }
      
      // Feedback visual específico para o campo de nome
      if (this.name === 'name') {
        const minLength = 3;
        if (this.value.trim().length > 0 && this.value.trim().length < minLength) {
          // Mostra quantos caracteres faltam
          const parent = this.parentNode;
          parent.classList.add('error');
          parent.setAttribute('data-error', `Faltam ${minLength - this.value.trim().length} caracteres`);
        } else {
          this.parentNode.removeAttribute('data-error');
        }
      }
      
      // Feedback visual específico para o campo de mensagem
      if (this.name === 'message') {
        const minLength = 10;
        if (this.value.trim().length > 0 && this.value.trim().length < minLength) {
          // Mostra quantos caracteres faltam
          const parent = this.parentNode;
          parent.classList.add('error');
          parent.setAttribute('data-error', `Faltam ${minLength - this.value.trim().length} caracteres`);
        } else {
          this.parentNode.removeAttribute('data-error');
        }
      }
    });
  });

  // Máscara para o telefone aprimorada
  function mascaraTelefone(input) {
    var telefone = input.value;

    // Remove caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Evita processamento desnecessário se não houver caracteres
    if (telefone.length === 0) {
      input.value = '';
      return;
    }

    // Adiciona parênteses ao DDD
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');

    // Limita o número de caracteres para 11 dígitos (DDD + número)
    telefone = telefone.substring(0, 15);

    // Formata baseado na quantidade de dígitos
    if (telefone.length > 10) {
      // Formato para celular: (99) 99999-9999
      telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    } else if (telefone.length > 6) {
      // Formato para telefone fixo: (99) 9999-9999
      telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
    }

    // Atualiza o campo com a máscara aplicada
    input.value = telefone;
  }

  // Adiciona o evento de input ao campo de telefone
  var campoTelefone = document.getElementById('numeroTelefone');
  if (campoTelefone) {
    campoTelefone.addEventListener('input', function () {
      mascaraTelefone(this);
      // Atualiza a classe focus quando digitar
      if (this.value !== "") {
        this.parentNode.classList.add("focus");
      }
    });
  }

  // Função para validar campos individuais com feedback
  function validarCampoIndividual(campo) {
    console.log(`Validando campo: ${campo.name}`);
    let valido = validarCampo(campo, true);
    return valido;
  }

  // Função para validar campos individuais com feedback visual de sucesso
  function validarCampo(campo, mostrarAlerta = false) {
    let valido = true;
    const parent = campo.parentNode;
    
    // Remove classes de erro e sucesso anteriores
    parent.classList.remove('error');
    parent.classList.remove('success');
    
    // Validação específica para cada tipo de campo
    switch(campo.name) {
      case 'name':
        valido = campo.value.trim().length >= 3;
        // Aplica feedback visual imediatamente
        if (!valido && campo.value.trim() !== '') {
          parent.classList.add('error');
          parent.setAttribute('data-error', `Mínimo de 3 caracteres`);
        } else {
          parent.removeAttribute('data-error');
        }
        console.log(`Nome: ${campo.value}, válido: ${valido}`);
        break;
      case 'email':
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        valido = regexEmail.test(campo.value);
        console.log(`Email: ${campo.value}, válido: ${valido}`);
        break;
      case 'numeroTelefone':
        if (campo.value.trim() !== '') {
          // Validação para telefone: (99) 99999-9999 ou (99) 9999-9999
          const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
          valido = regexTelefone.test(campo.value);
          
          // Se não for válido, tenta padronizar o formato
          if (!valido) {
            mascaraTelefone(campo);
            valido = regexTelefone.test(campo.value);
          }
        }
        console.log(`Telefone: ${campo.value}, válido: ${valido}`);
        break;
      case 'message':
        // Verifica se o campo é obrigatório ou tem conteúdo
        if (campo.hasAttribute('required') || campo.value.trim() !== '') {
          valido = campo.value.trim().length >= 10;
          // Aplica feedback visual imediatamente
          if (!valido) {
            parent.classList.add('error');
            parent.setAttribute('data-error', `Mínimo de 10 caracteres`);
          } else {
            parent.removeAttribute('data-error');
          }
        }
        console.log(`Mensagem: ${campo.value}, válido: ${valido}`);
        break;
    }
    
    // Aplica estilo de erro ou sucesso com base na validação
    if (campo.value.trim() !== '') {
      if (valido) {
        parent.classList.add('success');
      } else {
        parent.classList.add('error');
        
        // Se configurado para mostrar alerta e o campo tiver conteúdo
        if (mostrarAlerta) {
          // Mostra mensagem específica para o campo inválido
          Swal.fire({
            title: 'Campo inválido',
            text: obterMensagemErro(campo),
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1abc9c',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      }
    }
    
    return valido;
  }

  // Gerar mensagens de erro para campos específicos
  function obterMensagemErro(campo) {
    switch(campo.name) {
      case 'name':
        return 'O nome deve ter pelo menos 3 caracteres';
      case 'email':
        return 'Por favor, informe um email válido';
      case 'numeroTelefone':
        return 'Por favor, informe um telefone válido no formato (99) 99999-9999';
      case 'message':
        return 'A mensagem deve ter pelo menos 10 caracteres';
      default:
        return 'Campo inválido';
    }
  }

  // Validação completa do formulário usando SweetAlert2
  const formulario = document.getElementById('meuFormulario');

  // Verificar se o formulário existe antes de adicionar o event listener
  if (formulario) {
    console.log('Formulário encontrado. Adicionando event listener...');
    
    formulario.addEventListener('submit', function(event) {
      console.log('Formulário submetido!');
      // Sempre impedir o envio padrão do formulário para controlar o comportamento
      event.preventDefault();
      
      // Remover qualquer feedback visual anterior
      document.querySelectorAll('.input-container').forEach(container => {
        container.classList.remove('submit-error');
      });
      
      let formValido = true;
      const campos = this.querySelectorAll('.input');
      const camposComErro = [];
      
      // Validar todos os campos antes do envio
      campos.forEach(campo => {
        console.log(`Validando campo ${campo.name} no submit`);
        
        // Verifica campos obrigatórios e campos preenchidos (mesmo não obrigatórios)
        if (campo.hasAttribute('required') || campo.value.trim() !== '') {
          const campoValido = validarCampo(campo, false); // sem alerta individual
          
          if (!campoValido) {
            camposComErro.push({
              nome: campo.name,
              mensagem: obterMensagemErro(campo)
            });
          }
          
          // Se for obrigatório e estiver vazio, marca como inválido
          if (campo.hasAttribute('required') && campo.value.trim() === '') {
            camposComErro.push({
              nome: campo.name,
              mensagem: `O campo ${campo.name === 'name' ? 'nome' : campo.name === 'message' ? 'mensagem' : campo.name} é obrigatório`
            });
            formValido = false;
            
            // Adiciona classe de erro visual para campos obrigatórios vazios
            campo.parentNode.classList.add('error');
          } else {
            // Para campos não vazios, valida normalmente
            formValido = formValido && campoValido;
          }
        }
      });
      
      if (!formValido) {
        console.log('Formulário inválido. Exibindo erros...', camposComErro);
        
        // Adiciona classe que ativa a animação de tremor apenas no momento do erro de submissão
        formulario.classList.add('submit-error');
        
        // Lista de erros para exibir
        let listaErros = '';
        camposComErro.forEach(erro => {
          listaErros += `• ${erro.mensagem}<br>`;
        });
        
        // Exibe alerta de erro
        Swal.fire({
          title: 'Oops!',
          html: `Por favor, corrija os seguintes campos:<br><br>${listaErros}`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1abc9c'
        }).then(() => {
          // Remove a classe após mostrar o alerta
          setTimeout(() => {
            formulario.classList.remove('submit-error');
          }, 500);
        });
      } else {
        console.log('Formulário válido. Exibindo mensagem de sucesso...');
        // Se o formulário for válido, mostra mensagem de sucesso
        Swal.fire({
          title: 'Sucesso!',
          text: 'Sua mensagem foi enviada. Entraremos em contato em breve!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1abc9c'
        }).then(() => {
          // Limpar formulário
          formulario.reset();
          
          // Remove classes 'focus', 'error' e 'success' de todos os campos
          document.querySelectorAll('.input-container').forEach(container => {
            container.classList.remove('focus');
            container.classList.remove('error');
            container.classList.remove('success');
          });
          
          // Limpar os contadores de caracteres
          document.querySelectorAll('.character-counter').forEach(counter => {
            counter.textContent = '';
          });
        });
      }
    });
  } else {
    console.error('Formulário não encontrado na página');
  }

  // Monitorar eventos de input para garantir que não haja tremor durante a digitação
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      // Remove a classe submit-error ao começar a digitar
      const formulario = document.getElementById('meuFormulario');
      if (formulario && formulario.classList.contains('submit-error')) {
        formulario.classList.remove('submit-error');
      }
    });
  });

  // Adiciona contador de caracteres para o campo de mensagem
  const textareaField = document.querySelector('textarea[name="message"]');
  if (textareaField) {
    // Cria elemento para mostrar o contador
    const counterElement = document.createElement('div');
    counterElement.className = 'character-counter';
    counterElement.style.position = 'absolute';
    counterElement.style.bottom = '10px';
    counterElement.style.right = '15px';
    counterElement.style.fontSize = '0.75rem';
    counterElement.style.color = 'rgba(255, 255, 255, 0.7)';
    textareaField.parentNode.appendChild(counterElement);
    
    // Atualiza o contador quando o usuário digitar
    textareaField.addEventListener('input', function() {
      const currentLength = this.value.trim().length;
      const minLength = 10;
      
      if (currentLength > 0) {
        if (currentLength < minLength) {
          counterElement.style.color = 'rgba(231, 76, 60, 0.9)';
          counterElement.textContent = `${currentLength}/${minLength}`;
        } else {
          counterElement.style.color = 'rgba(255, 255, 255, 0.7)';
          counterElement.textContent = `${currentLength}`;
        }
      } else {
        counterElement.textContent = '';
      }
    });
  }

  // Adiciona também para o nome
  const nameField = document.querySelector('input[name="name"]');
  if (nameField) {
    // Cria elemento para mostrar o contador
    const counterElement = document.createElement('div');
    counterElement.className = 'character-counter';
    counterElement.style.position = 'absolute';
    counterElement.style.top = '50%';
    counterElement.style.right = '15px';
    counterElement.style.fontSize = '0.75rem';
    counterElement.style.color = 'rgba(255, 255, 255, 0.7)';
    counterElement.style.transform = 'translateY(-50%)';
    nameField.parentNode.appendChild(counterElement);
    
    // Atualiza o contador quando o usuário digitar
    nameField.addEventListener('input', function() {
      const currentLength = this.value.trim().length;
      const minLength = 3;
      
      if (currentLength > 0) {
        if (currentLength < minLength) {
          counterElement.style.color = 'rgba(231, 76, 60, 0.9)';
          counterElement.textContent = `${currentLength}/${minLength}`;
        } else {
          counterElement.style.color = 'rgba(255, 255, 255, 0.7)';
          counterElement.textContent = `${currentLength}`;
          // Remove o contador após 2 segundos quando o comprimento for adequado
          setTimeout(() => {
            if (this.value.trim().length >= minLength) {
              counterElement.textContent = '';
            }
          }, 2000);
        }
      } else {
        counterElement.textContent = '';
      }
    });
  }
});













