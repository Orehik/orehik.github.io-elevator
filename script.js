const buttons = document.querySelectorAll('.button'); // нашли кнопки
const elevator = document.querySelector('#elevator'); // нашли лифт
let started = false; // находится ли лифт в движении
let firstFloor = 303; // изначальная позиция лифта
const step = 150; // высота этажа

// накидываем на кнопки слушатель событий 'click' и проверяем статус движения лифта в момент нажатия
buttons.forEach((elem) => {
  elem.addEventListener('click', (event) => {
    if (!started) {
      started = true; // лифт движется
      clickButtons(event);
    }
  });
});

document.addEventListener('submit', addFloors);

// фунция для запуска перемещения лифта
function clickButtons(event) {
  const frame = 3; // смещение лифта за кадр

  // определение целевого этажа
  let floor = null;
  if (event.target.localName === 'div') {
    floor = event.target.parentElement.parentElement;
  } else {
    floor = event.target.parentElement;
  }

  const currentCorridor = document.querySelector('[data-mark]'); // текущий коридор
  const currentMultiplier = currentCorridor.dataset.number - 1; // множитель для текущего этажа
  const currentFloorPosition = firstFloor - step * currentMultiplier; // текущий top для лифта (старт)

  const targetCorridor = floor.querySelector('.corridor'); // коридор где должен остановится лифт
  const targetMultiplier = targetCorridor.dataset.number - 1; // множитель для целевого этажа
  const targetFloorPosition = firstFloor - step * targetMultiplier; // новый top для лифта (финиш)

  let top = currentFloorPosition; // вспомогательная переменная для изменения положения лифта
  elevator.style.top = `${top}px`; // задание inline стиля для дальнейшего изменения положения

  // перемещение марки
  currentCorridor.removeAttribute('data-mark');
  targetCorridor.setAttribute('data-mark', '*');

  // запуск анимации движения лифта
  const moveAnimation = setInterval(() => {
    // логика остановки интервала
    if (top === targetFloorPosition) {
      started = false;
      clearInterval(moveAnimation);
      return;
    }
    // определение направления движения лифта
    if (currentFloorPosition > targetFloorPosition) {
      top -= frame;
    }
    if (currentFloorPosition < targetFloorPosition) {
      top += frame;
    }
    elevator.style.top = `${top}px`; // само перемещение лифта
  }, 20);
}

function addFloors(event) {
  event.preventDefault();
  const currentButtons = document.querySelectorAll('.button'); // нашли кнопки
  let buildingLength = currentButtons.length; // высота здания
  const building = document.querySelector('#building'); // само здание
  const countFloors = event.target.count.value; // новая высота здания
  if (countFloors <= buildingLength) {
    return;
  }
      // достройка новых этажей
  while (countFloors > buildingLength) {
    const dataSet = building.querySelector('.floor .corridor').dataset.number; // номер последнего этажа
    const newFloor = document.createElement('tr');
    newFloor.className += 'floor';

    const newCorridor = document.createElement('td');
    newCorridor.dataset.number = Number(dataSet) + 1; // номер текущего этажа
    newCorridor.className += 'corridor';

    const newMine = document.createElement('td');
    newMine.className += 'mine';

    const newButton = document.createElement('td');
    newButton.className += 'button';

    const newDiv = document.createElement('div');
    newButton.prepend(newDiv);
    newFloor.addEventListener('click', (event) => {
      if (!started) {
        started = true; // лифт движется
        clickButtons(event);
      }
    });

    newFloor.append(newCorridor, newMine, newButton);
    building.prepend(newFloor);

    firstFloor += step;

    buildingLength++;
  }
  const currentCorridor = document.querySelector('[data-mark]'); // текущее положение марки

  const corridorList = building.querySelectorAll('[data-number]'); // все корридоры
  const firstCorridor = corridorList[corridorList.length - 1]; // нашли первый корридор

  // перемещение марки
  currentCorridor.removeAttribute('data-mark'); // удалили марку с корридора где находился лифт
  firstCorridor.setAttribute('data-mark', '*'); // присвоили марку где лифт находится в данный момент (1 этаж)

  elevator.style.top = `${firstFloor}px`;
  const input = document.forms.countFloors.count;
  input.min = buildingLength;
}
