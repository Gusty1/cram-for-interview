import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Portal, Modal, Chip, Button } from 'react-native-paper'
import useStore from '../../store'
import MyText from '../MyComponents/MyText'
import { homeStyle } from '../../styles'

const SubtitleFilterModal = ({ filterModalShow, filterSubtile, showSubtitleItems }) => {
  const [subtitlesItems, setSubtitlesItems] = useState([])
  const { setting } = useStore()

  //切換選種狀態
  const changeSelected = (id) => {
    if (!id) {
      setSubtitlesItems(
        subtitlesItems.map((item) => {
          item.selected = false
          return item
        })
      )
    } else {
      setSubtitlesItems(
        subtitlesItems.map((item) => {
          if (item.id === id) item.selected = !item.selected
          return item
        })
      )
    }
  }

  //接收傳來的副主題
  useEffect(() => {
    setSubtitlesItems(showSubtitleItems);
  }, [showSubtitleItems])

  return (
    <Portal>
      <Modal
        visible={filterModalShow}
        dismissable={true}
        onDismiss={() => filterSubtile()}
        dismissableBackButton={true}
        contentContainerStyle={{
          ...homeStyle.subtitleFilterModalContainer,
          backgroundColor: setting.darkMode ? '#3d3a27' : '#ffebcd'
        }}
      >
        <View style={homeStyle.subtitleFilterModalMainView}>
          <MyText style={{ flex: 1 }}>
            選擇要顯示的項目:
          </MyText>
          <Button mode='contained-tonal' onPress={() => changeSelected()}>
            重置
          </Button>
        </View>
        <View style={homeStyle.subtitleFilterModalChipView}>
          {subtitlesItems.map((item) => (
            <Chip
              key={item.id}
              mode='outlined'
              selected={item.selected}
              showSelectedCheck={false}
              style={{
                backgroundColor: item.selected ? 'skyblue' : 'transparent',
                marginRight: 5,
                marginBottom: 5
              }}
              onPress={() => changeSelected(item.id)}
            >
              <MyText>{item.zh_name}</MyText>
            </Chip>
          ))}
        </View>
      </Modal>
    </Portal>
  )
}

export default SubtitleFilterModal
