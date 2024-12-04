import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/API";
import "./FightPage.css";

interface Ship {
    id: string;
    ship_name: string;
    description: string;
    year: number;
    displacement: number;
    length: number;
    crew: number;
    country: string;
    photo: string;
}

interface Fight {
    id: string;
    fight_name: string;
    result: string;
    sailors: number;
    ships: { ship: Ship; admiral: string }[];
    created_at: string;
    status: string;
}

const FightPage = () => {
    const { fightId } = useParams<{ fightId: string }>();
    const navigate = useNavigate();
    const [fight, setFight] = useState<Fight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getFightDetails = async () => {
            if (!fightId) return;

            try {
                const response = await API.getFightById(Number(fightId));
                const data = await response.json();
                setFight(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о сражении:", error);
                setError("Не удалось загрузить данные о сражении");
            } finally {
                setLoading(false);
            }
        };

        getFightDetails();
    }, [fightId]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!fight) return <div>Сражение не найдено.</div>;

    const isEditable = fight.status !== 'f' && fight.status !== 'c' && fight.status !== 'r';

    const handleSubmit = async () => {
        try {
            await API.formFight(Number(fightId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при завершении сражения:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await API.deleteFight(Number(fightId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleShipDelete = async (shipId: string, index: number) => {
        if (!fight) return;
        try {
            await API.deleteShipFromDraft(Number(fightId), Number(shipId));
            const updatedShips = [...fight.ships];
            updatedShips.splice(index, 1); // Удаляем корабль из массива
            setFight({ ...fight, ships: updatedShips });
        } catch (error) {
            console.error('Ошибка при удалении корабля:', error);
        }
    };

    // Обработчик для потери фокуса в поле Названия сражения
    const handleFightNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const newFightName = e.target.value;
        if (newFightName !== fight?.fight_name) {
            // Вызов существующего метода changeAddFields из API
            await API.changeAddFields(Number(fightId), newFightName); // Отправка PUT запроса
        }
    };

    // Обработчик для потери фокуса в поле Результата
    const handleResultBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const newResult = e.target.value;
        if (newResult !== fight?.result) {
            // Вызов существующего метода changeAddFields из API
            await API.changeAddFields(Number(fightId), undefined, newResult); // Отправка PUT запроса
        }
    };

    return (
        <div className="fight-page">
            <h1 className="fight-name-fix">Название сражения</h1>
            <input
                type="text"
                value={"fight.fight_name"}
                className="fight-name-input"
                onBlur={handleFightNameBlur}  // Добавляем обработчик потери фокуса
                disabled={!isEditable}  // Сделать поле недоступным, если не редактируемое
            />
            <div className="battle-container">
                {fight.ships.map(({ ship, admiral }, index) => (
                    <div key={index} className="battle-row">
                        {/* Карточка корабля */}
                        <div className="ship-card">
                            <img src={ship.photo} alt={ship.ship_name} className="ship-photo" />
                            <div className="ship-info">
                                <h1>{ship.ship_name}</h1>
                                <h4><strong>Экипаж:</strong> {ship.crew}</h4>
                                {isEditable && (
                                    <button className="fight-delete" onClick={() => handleShipDelete(ship.id, index)}>
                                        Удалить
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Карточка адмирала */}
                        <div className="admiral-card">
                            <h2>Адмирал</h2>
                            <input
                                type="text"
                                value={admiral}
                                className="admiral-input"
                                onChange={(e) => {
                                    const updatedShips = [...fight.ships];
                                    updatedShips[index].admiral = e.target.value;
                                    setFight({ ...fight, ships: updatedShips });
                                }}
                                disabled={!isEditable}  // Сделать поле недоступным, если не редактируемое
                            />
                        </div>
                    </div>
                ))}
            </div>
            <h1 className="fight-result-fix">Итог сражения</h1>
            <div className="result-section">
                <input
                    value={fight.result}
                    className="fight-result-input"
                    onBlur={handleResultBlur}  // Добавляем обработчик потери фокуса
                    disabled={!isEditable}  // Сделать поле недоступным, если не редактируемое
                />
            </div>
            <div className="button-container">
                {isEditable ? (
                    <>
                    <button className="fight-submit" onClick={handleSubmit}>
                        Оформить
                    </button>
                    <button className="fight-delete" onClick={handleDelete}>
                        Удалить
                    </button>
                    </>
                ) : (
                    <>
                    </>
                )}
            </div>
            {!isEditable && fight.sailors != null && (
                <div className="total-cost">
                    Общее количество участников сражения: {fight.sailors}
                </div>
            )}
        </div>
    );
};

export default FightPage;