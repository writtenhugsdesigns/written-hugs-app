
import './PitchCategory.css';

export default function PitchCategory({categoryContents}){
    return (
        <div className = 'pitchCategoryContainer'>
            <div className = 'pitchCategoryHeader'>
                <h2 className = 'pitchH2'>{categoryContents.category_name}</h2>
            </div>
            <div className = 'categoryCardContainer'>

            </div>
        </div>
    )
}