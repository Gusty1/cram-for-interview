import { MyMainView, Sentence, Subject } from '../../../../components'

const SubjectScreen = ({navigation}) => {
  return (
    <MyMainView>
      <Sentence />
      <Subject navigation={navigation} />
    </MyMainView>
  );
};

export default SubjectScreen
